import type { ConsumeMessage } from '@src/types/amqp';
import { MessageZaloField } from '../type';
import { rabbit_server } from '@src/connect';
import { VideoTDBodyField } from '@src/dataStruct/video';

export async function consumeMessage(queue: string, callback: (messageZalo: MessageZaloField) => void) {
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

            const data = JSON.parse(msg.content.toString());
            // console.log('Received:', data);
            callback(data);

            channel.ack(msg);
        },
        { noAck: false }
    );
}

export async function consumeMessageTD(queue: string, callback: (messageZalo: VideoTDBodyField | any) => void) {
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

            const data = JSON.parse(msg.content.toString());
            // console.log('Received:', data);
            callback(data);

            channel.ack(msg);
        },
        { noAck: false }
    );
}
