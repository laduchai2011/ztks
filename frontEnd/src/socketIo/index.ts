import { SOCKET_URL } from '@src/const/api/socketUrl';
import { SocketType } from '@src/dataStruct/socketIo';
import io from 'socket.io-client';
import { getCookie } from '@src/utility/cookie';

let socket: SocketType | null = null;

export const getSocket = () => {
    if (!socket) {
        socket = io(SOCKET_URL || '', { path: '/socket.io/', auth: { token: getCookie('socketToken') || '' } });
        // socket = io('wss://socketapp.5kaquarium.com', {
        //     path: "/socket.io/",
        // });

        socket.on('connect', () => {
            console.log('socket connected', socket?.id);
        });

        socket.on('connect_error', (err: any) => {
            console.log('socket connect error', err);
        });
    }
    return socket;
};
