import { SOCKET_URL } from '@src/const/api/socket_url';
import { Socket_Type } from '@src/data_struct/socket_io';
import io from 'socket.io-client';
import { get_Cookie } from '@src/utility/cookie';

let socket: Socket_Type | null = null;

export const get_Socket = () => {
    if (!socket) {
        socket = io(SOCKET_URL || '', { path: '/socket.io/', auth: { token: get_Cookie('socketToken') || '' } });
        // socket = io('wss://socket.taokosao.com', {
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
