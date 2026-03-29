// export interface ConsumeMessage {
//     content: Buffer;
//     fields: any;
//     properties: any;
// }

// export interface Channel {
//     assertQueue(queue: string): Promise<any>;
//     consume(queue: string, onMessage: (msg: ConsumeMessage | null) => void): any;
//     ack(msg: ConsumeMessage): void;
//     sendToQueue(queue: string, content: Buffer): boolean;
// }

// export interface Connection {
//     createChannel(): Promise<Channel>;
//     on(event: string, handler: (...args: any[]) => void): void;
//     close(): void;
// }

export interface ConsumeMessage {
    content: Buffer;
    fields: any;
    properties: any;
}

interface assertQueue_durable {
    durable: boolean;
}
interface sendToQueue_noAck {
    noAck: boolean;
}
interface sendToQueue_persistent {
    persistent: boolean;
}
export interface Channel {
    assertQueue(queue: string, assertQueuedurable: assertQueue_durable): Promise<any>;
    consume(queue: string, onMessage: (msg: ConsumeMessage | null) => void, sendToQueuenoAck: sendToQueue_noAck): any;
    ack(msg: ConsumeMessage): void;
    sendToQueue(queue: string, content: Buffer, sendToQueuepersistent: sendToQueue_persistent): boolean;
    prefetch(number: number): void;
}

export interface Connection {
    createChannel(): Promise<Channel>;
    on(event: string, handler: (...args: any[]) => void): void;
    close(): void;
}
