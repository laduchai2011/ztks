import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { consumeMessage, consumeMessageTD, consumeStringMessage } from '@src/messageQueue/Consumer';
import { sendMessage, sendMessageTD } from '@src/messageQueue/Producer';
import { MessageZaloField } from './messageQueue/type';
import process from 'process';
import { customerSend_sendToMember, memberSend_sendToCustomer } from '@src/const/keyRabbitMQ';
import { SocketMessageField } from './dataStruct/message_v1';
import { AgentPayField } from './dataStruct/agent';
import { OrderField } from './dataStruct/order';

dotenv.config();

const isProduct = process.env.NODE_ENV === 'production';
const dev_prefix = isProduct ? '' : 'dev';

const httpServer = createServer(); // ❗ Không dùng Express

// const io = new Server(httpServer);
const io = new Server(httpServer, {
    cors: {
        origin: 'http://zalo5k.local.com:3000',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

consumeStringMessage(`store_msg_success_${dev_prefix}`, (msg) => {
    const socketMsg = JSON.parse(msg) as SocketMessageField;
    const allChatRoomRole = socketMsg.allChatRoomRoles;
    io.to(socketMsg.chatRoomId.toString()).emit('socketMessage', socketMsg);
    for (let i: number = 0; i < allChatRoomRole.length; i++) {
        io.to(allChatRoomRole[i].authorizedAccountId.toString()).emit('socketMessageAllRoom', socketMsg);
    }
});

consumeStringMessage('agentPay_dev', (data) => {
    const agentPay = JSON.parse(data) as AgentPayField;
    io.to(agentPay.accountId.toString()).emit('agentPay', agentPay);
});

consumeStringMessage('orderPay_dev', (data) => {
    const order = JSON.parse(data) as OrderField;
    io.to(order.accountId.toString()).emit('orderPay', order);
});

// chuan bi bo
// consumeMessage(customerSend_sendToMember, (data) => {
//     const room = data.accountId.toString() + data.data.sender.id;
//     const myRoom = data.accountId.toString();
//     io.to(myRoom).emit('roomMessage', JSON.stringify(data));
//     io.to(room).emit('roomMessage', JSON.stringify(data));
// });

// consumeMessageTD(`open_chatRoom_tadao_success_${dev_prefix}`, async ({ oaid, uid, accountId }) => {
//     const myRoom = accountId + uid;
//     io.to(myRoom).emit('open_chatRoom_tadao_success', {});
// });

// consumeMessageTD(`open_chatRoom_tadao_failure_${dev_prefix}`, async ({ oaid, uid, accountId }) => {
//     const myRoom = accountId + uid;
//     io.to(myRoom).emit('open_chatRoom_tadao_failure', {});
// });

// consumeMessageTD(`send_videoTD_success_${dev_prefix}`, async ({ oaid, uid, accountId, name }) => {
//     const myRoom = accountId + uid;
//     io.to(myRoom).emit('send_videoTD_success', {});
// });

// consumeMessageTD(`send_videoTD_failure_${dev_prefix}`, async ({ oaid, uid, accountId, name }) => {
//     const myRoom = accountId + uid;
//     io.to(myRoom).emit('send_videoTD_failure', {});
// });

// consumeMessageTD(`getUrl_videoTd_${dev_prefix}`, async ({ oaid, uid, accountId, name }) => {
//     const myRoom = accountId + uid;
//     io.to(myRoom).emit('getUrl_videoTd', { oaid, uid, accountId, name });
// });

// consumeMessage('test', (data) => {
// });

// Lắng nghe connection
io.on('connection', (socket) => {
    // console.log('User connected:', socket.id);

    // Tham gia phòng
    socket.on('joinRoom', (roomName: string) => {
        socket.join(roomName);
        console.log(`User ${socket.id} joined room ${roomName}`);

        // Thông báo cho tất cả trong phòng
        // io.to(roomName).emit('systemMessage', `User ${socket.id} joined the room`);
    });

    // socket.on('open_chatRoom_tadao', ({ oaid, uid, accountId }) => {
    //     const status: string = 'open';
    //     sendMessageTD(`chatRoom_tadao_${dev_prefix}`, { status, oaid, uid, accountId });
    // });

    // socket.on('close_chatRoom_tadao', ({ oaid, uid, accountId }) => {
    //     const status: string = 'close';
    //     sendMessageTD(`chatRoom_tadao_${dev_prefix}`, { status, oaid, uid, accountId });
    // });

    // // Gửi tin nhắn trong phòng
    // socket.on('roomMessage', ({ roomName, message }) => {
    //     // socket.emit('roomMessage', { roomName: 'room1', message: 'server hello' });
    //     const messageZalo: MessageZaloField = {
    //         data: message,
    //         isNewCustom: false,
    //         accountId: -1,
    //     };
    //     console.log(message);
    //     // sendMessage('test', messageZalo);
    //     sendMessage(memberSend_sendToCustomer, messageZalo);
    //     // io.to(roomName).emit('roomMessage', `server hello: ${message}`);
    // });

    // socket.on('send_videoTD', ({ receiveId, oaid, name, accountId }) => {
    //     sendMessageTD('send_videoTD', {
    //         receiveId: receiveId,
    //         oaid: oaid,
    //         name: name,
    //         accountId: accountId,
    //     });
    // });

    // Rời phòng
    socket.on('leaveRoom', (roomName: string) => {
        socket.leave(roomName);
        io.to(roomName).emit('systemMessage', `User ${socket.id} left the room`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Chạy server
const port = isProduct ? process.env.PORT : 1000;
httpServer.listen(port, () => {
    console.log(`Socket.IO server running on port ${port}`);
});
