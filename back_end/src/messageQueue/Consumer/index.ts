import type { ConsumeMessage } from '@src/types/amqp';
import { rabbit_server } from '@src/connect';
import { MessageZaloField } from '../type';
import { Hook_Data_Field, Hook_Call_Field } from '@src/data_struct/zalo/hookData';
import { Video_Message_Body_Field } from '../../data_struct/message_v1/body';
import { Update_Statistics_Body_Field } from '@src/data_struct/statistics/body';

export async function consume_Message(queue: string, callback: (messageZalo: MessageZaloField) => void) {
    await rabbit_server.init();

    const channel = await rabbit_server.getConsumerChannel(queue);

    await channel.assertQueue(queue, { durable: true });

    channel.prefetch(1);

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

export async function consume_Hook_Data(
    queue: string,
    callback: (data: Hook_Data_Field | Hook_Call_Field) => Promise<void> | void
) {
    await rabbit_server.init();

    const channel = await rabbit_server.getConsumerChannel(queue);

    await channel.assertQueue(queue, { durable: true });

    channel.prefetch(1);

    channel.consume(
        queue,
        async (msg: ConsumeMessage | null) => {
            if (!msg) {
                console.log(msg);
                return;
            }

            try {
                const data = JSON.parse(msg.content.toString());

                await callback(data);

                // Chỉ ACK khi xử lý thành công
                channel.ack(msg);
            } catch (error) {
                console.error('Error processing RabbitMQ message:', error);

                // Xử lý lại message
                channel.nack(msg, false, true);
            }
        },
        { noAck: false }
    );
}

export async function consume_String_Message(queue: string, callback: (msg: string) => void) {
    await rabbit_server.init();

    const channel = await rabbit_server.getConsumerChannel(queue);

    await channel.assertQueue(queue, { durable: true });

    channel.prefetch(1);

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

export async function consume_Video_Message(
    queue: string,
    callback: (video_message_body: Video_Message_Body_Field) => void
) {
    await rabbit_server.init();

    const channel = await rabbit_server.getConsumerChannel(queue);

    await channel.assertQueue(queue, { durable: true });

    channel.prefetch(1);

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

export async function consume_Statistics(
    queue: string,
    callback: (statistics: Update_Statistics_Body_Field) => Promise<boolean>
) {
    await rabbit_server.init();

    const channel = await rabbit_server.getConsumerChannel(queue);

    await channel.assertQueue(queue, { durable: true });

    channel.prefetch(1);

    channel.consume(
        queue,
        async (msg: ConsumeMessage | null) => {
            if (!msg) {
                console.log(msg);
                return;
            }

            try {
                const data = JSON.parse(msg.content.toString()) as Update_Statistics_Body_Field;

                const isSuccessful = await callback(data);

                // Chỉ ACK khi xử lý thành công
                if (isSuccessful) {
                    channel.ack(msg);
                } else {
                    channel.nack(msg, false, true);
                }
            } catch (error) {
                console.error('Error processing RabbitMQ message:', error);

                // Xử lý lại message
                channel.nack(msg, false, true);
            }
        },
        { noAck: false }
    );
}
