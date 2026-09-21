import { io } from 'socket.io-client';

export type Socket_Type = ReturnType<typeof io>;
