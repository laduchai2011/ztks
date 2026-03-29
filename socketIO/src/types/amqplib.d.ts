/* eslint-disable import/no-unused-modules */
declare module 'amqplib' {
    import { Connection } from './amqp';
    export function connect(url: string): Promise<Connection>;
}
