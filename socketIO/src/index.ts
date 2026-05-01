import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { consumeMessage, consumeStringMessage, consumeVideoMessage } from '@src/messageQueue/Consumer';
import { sendMessage } from '@src/messageQueue/Producer';
import { MessageZaloField } from './messageQueue/type';
import process from 'process';
import { customerSend_sendToMember, memberSend_sendToCustomer } from '@src/const/keyRabbitMQ';
import { SocketMessageField } from './dataStruct/message_v1';
import { AgentPayField } from './dataStruct/agent';
import { OrderField } from './dataStruct/order';
import { verifySocketToken } from './token';
import { VideoMessageBodyField } from './dataStruct/message_v1/body';

dotenv.config();

const isProduct = process.env.NODE_ENV === 'production';
const dev_prefix = isProduct ? '' : 'dev';

const httpServer = createServer(); // ❗ Không dùng Express

// const io = new Server(httpServer);
const io = new Server(httpServer, {
    cors: {
        origin: ['http://zalo5k.local.com:3000', 'http://zalo5k.local.com:3001', 'http://zalo5k.local.com:3002'],
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

consumeStringMessage(`store_msg_success_${dev_prefix}`, (msg) => {
    const socketMsg = JSON.parse(msg) as SocketMessageField;
    const allChatRoomRole = socketMsg.allChatRoomRoles;
    io.to(`chatRoomId_${socketMsg.chatRoomId}`).emit('socketMessage', socketMsg);
    for (let i: number = 0; i < allChatRoomRole.length; i++) {
        io.to(`accountId_${allChatRoomRole[i].authorizedAccountId}`).emit('socketMessageAllRoom', socketMsg);
    }
});

consumeVideoMessage(`sendVideoMessage_${dev_prefix}`, (videoMessageBody) => {
    io.to(`playwright_${videoMessageBody.zaloAppId}`).emit('sendVideo_with_zalo_app_id', videoMessageBody);
});

consumeStringMessage(`agentPay_${dev_prefix}`, (data) => {
    const agentPay = JSON.parse(data) as AgentPayField;
    io.to(`accountId_${agentPay.accountId}`).emit('agentPay', agentPay);
});

consumeStringMessage(`orderPay_${dev_prefix}`, (payload) => {
    const data = JSON.parse(payload);
    const accountId = data.accountId as number;
    const order = data.order as OrderField;
    io.to(`accountId_${accountId}`).emit('orderPay', order);
});

io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    try {
        const verify_socketToken = verifySocketToken(token);

        if (verify_socketToken === 'invalid') {
            return next(new Error('Token invalid'));
        }
        if (verify_socketToken === 'expired') {
            return next(new Error('Token expired'));
        }
        socket.data.verify_socketToken = verify_socketToken;
        next();
    } catch (err) {
        console.error(err);
        next(new Error('Unauthorized'));
    }
});

// Lắng nghe connection
io.on('connection', (socket) => {
    // console.log('User connected:', socket.id);
    // console.log(1111, socket.data.verify_socketToken);

    // Tham gia phòng
    socket.on('joinRoom', (roomName: string) => {
        socket.join(roomName);
        console.log(`User ${socket.id} joined room ${roomName}`);

        // Thông báo cho tất cả trong phòng
        // io.to(roomName).emit('systemMessage', `User ${socket.id} joined the room`);
    });

    socket.on('playwrightOnline-onApp', ({ zaloAppId, accountId }) => {
        // console.log('Playwright is online on app, zaloAppId:', zaloAppId, 'accountId:', accountId);
        io.to(`playwright_${zaloAppId}`).emit('playwrightOnline-playwightOn', {
            zaloAppId: zaloAppId,
            accountId: accountId,
        });
    });

    socket.on('playwrightOnline-onPlaywright', ({ zaloAppId, accountId }) => {
        // console.log('Playwright is online on playwright, zaloAppId:', zaloAppId, 'accountId:', accountId);
        io.to(`accountId_${accountId}`).emit('playwrightOnline-appOn', {
            zaloAppId: zaloAppId,
            accountId: accountId,
        });
    });

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
