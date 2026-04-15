import type { ConsumeMessage } from '@src/types/amqp';
import { rabbit_server } from '@src/connect';
import { MessageZaloField } from '../type';
// import { MessageInput } from '@src/schema/message';
import { HookDataField } from '@src/dataStruct/zalo/hookData';
import { VideoMessageBodyField } from '../../dataStruct/message_v1/body';

rabbit_server.init();

export async function consumeMessage(queue: string, callback: (messageZalo: MessageZaloField) => void) {
    const channel = await rabbit_server.createChannel();

    await channel.assertQueue(queue, { durable: true });

    channel.prefetch(10);

    channel.consume(
        queue,
        (msg: ConsumeMessage | null) => {
            if (!msg) {
                console.log(msg);
                return;
            }

            const data = JSON.parse(msg.content.toString());
            // console.log('Received:', data);
            callback(data);

            channel.ack(msg);
        },
        { noAck: false }
    );
}

export async function consumeHookData(queue: string, callback: (data: HookDataField) => void) {
    const channel = await rabbit_server.createChannel();

    await channel.assertQueue(queue, { durable: true });

    channel.prefetch(10);

    channel.consume(
        queue,
        (msg: ConsumeMessage | null) => {
            if (!msg) {
                console.log(msg);
                return;
            }

            const data = JSON.parse(msg.content.toString());
            // console.log('Received:', data);
            callback(data);

            channel.ack(msg);
        },
        { noAck: false }
    );
}

export async function consumeStringMessage(queue: string, callback: (msg: string) => void) {
    await rabbit_server.init();
    const channel = await rabbit_server.createChannel();

    await channel.assertQueue(queue, { durable: true });

    channel.prefetch(10);

    channel.consume(
        queue,
        (msg: ConsumeMessage | null) => {
            if (!msg) {
                console.log(msg);
                return;
            }

            callback(msg.content.toString());

            channel.ack(msg);
        },
        { noAck: false }
    );
}

export async function consumeVideoMessage(queue: string, callback: (videoMessageBody: VideoMessageBodyField) => void) {
    await rabbit_server.init();
    const channel = await rabbit_server.createChannel();

    await channel.assertQueue(queue, { durable: true });

    channel.prefetch(10);

    channel.consume(
        queue,
        (msg: ConsumeMessage | null) => {
            if (!msg) {
                console.log(msg);
                return;
            }

            callback(JSON.parse(msg.content.toString()));

            channel.ack(msg);
        },
        { noAck: false }
    );
}
