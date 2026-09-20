import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { consume_String_Message, consume_Video_Message } from '@src/messageQueue/Consumer';
import process from 'process';
import { Socket_Message_Field } from './data_struct/message_v1';
import { Agent_Pay_Field } from './data_struct/agent';
import { Order_Field } from './data_struct/order';
import { verify_Socket_Token } from './token';
import { redis_config } from '@src/config';

dotenv.config();

const isProduct = process.env.NODE_ENV === 'production';
const prefix = isProduct ? '' : 'dev';

const originArray: string[] = isProduct
    ? ['https://wztks.taokosao.com', 'https://ztks.taokosao.com', 'https://mtks.taokosao.com']
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'];

const redisUrl: string = `redis://${redis_config?.username}:${redis_config?.password}@${redis_config?.host}:${redis_config?.port}`;

async function bootstrap() {
    const pubClient = createClient({
        url: redisUrl,
    });

    const subClient = pubClient.duplicate();

    pubClient.on('error', (err) => {
        console.error('[Redis PUB]', err);
    });

    subClient.on('error', (err) => {
        console.error('[Redis SUB]', err);
    });

    await Promise.all([pubClient.connect(), subClient.connect()]);

    const httpServer = createServer(); // ❗ Không dùng Express
    const io = new Server(httpServer, {
        cors: {
            origin: originArray,
            methods: ['GET', 'POST'],
            credentials: true,
        },
        adapter: createAdapter(pubClient, subClient),
    });

    consume_String_Message(`store_msg_success_${prefix}`, (msg) => {
        const socket_msg = JSON.parse(msg) as Socket_Message_Field;
        const all_chat_room_roles = socket_msg.all_chat_room_roles;
        io.to(`chatRoomId_${socket_msg.chat_room_id}`).emit('socketMessage', socket_msg);
        for (let i: number = 0; i < all_chat_room_roles.length; i++) {
            io.to(`accountId_${all_chat_room_roles[i].authorized_account_id}`).emit('socketMessageAllRoom', socket_msg);
        }
    });

    consume_Video_Message(`sendVideoMessage_${prefix}`, (video_message_body) => {
        io.to(`playwright_${video_message_body.zalo_app_id}`).emit('sendVideo_with_zalo_app_id', video_message_body);
    });

    consume_String_Message(`agentPay_${prefix}`, (data) => {
        const agent_pay = JSON.parse(data) as Agent_Pay_Field;
        io.to(`accountId_${agent_pay.account_id}`).emit('agentPay', agent_pay);
    });

    consume_String_Message(`orderPay_${prefix}`, (payload) => {
        const data = JSON.parse(payload);
        const account_id = data.account_id as string;
        const order = data.order as Order_Field;
        io.to(`accountId_${account_id}`).emit('orderPay', order);
    });

    io.use((socket, next) => {
        const token = socket.handshake.auth.token;

        try {
            const verify_socket_token = verify_Socket_Token(token);

            if (verify_socket_token === 'invalid') {
                return next(new Error('Token invalid'));
            }
            if (verify_socket_token === 'expired') {
                return next(new Error('Token expired'));
            }
            socket.data.verify_socket_token = verify_socket_token;
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
        socket.on('joinRoom', (room_name: string) => {
            socket.join(room_name);
            console.log(`User ${socket.id} joined room ${room_name}`);

            // Thông báo cho tất cả trong phòng
            // io.to(roomName).emit('systemMessage', `User ${socket.id} joined the room`);
        });

        socket.on('playwrightOnline-onApp', ({ zalo_app_id, account_id }) => {
            // console.log('Playwright is online on app, zaloAppId:', zaloAppId, 'accountId:', accountId);
            io.to(`playwright_${zalo_app_id}`).emit('playwrightOnline-playwightOn', {
                zalo_app_id: zalo_app_id,
                account_id: account_id,
            });
        });

        socket.on('playwrightOnline-onPlaywright', ({ zalo_app_id, account_id }) => {
            // console.log('Playwright is online on playwright, zaloAppId:', zaloAppId, 'accountId:', accountId);
            io.to(`accountId_${account_id}`).emit('playwrightOnline-appOn', {
                zalo_app_id: zalo_app_id,
                account_id: account_id,
            });
        });

        // Rời phòng
        socket.on('leaveRoom', (room_name: string) => {
            socket.leave(room_name);
            io.to(room_name).emit('systemMessage', `User ${socket.id} left the room`);
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
}

bootstrap().catch((err) => {
    console.error(err);
    process.exit(1);
});
