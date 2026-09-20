import { rabbit_server } from '@src/connect';
import { Message_Zalo_Field } from '../type';
import { Video_Message_Body_Field } from '../../data_struct/message_v1/body';
import { Update_Statistics_Body_Field } from '@src/data_struct/statistics/body';

export async function send_Message(queue: string, messageZalo: Message_Zalo_Field) {
    await rabbit_server.init();

    const channel = await rabbit_server.getPublishChannel();

    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(messageZalo)), { persistent: true });
}

export async function send_Hook_Data(queue: string, hookData: any) {
    await rabbit_server.init();

    const channel = await rabbit_server.getPublishChannel();

    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(hookData)), { persistent: true });
}

export async function send_String_Message(queue: string, msg: string) {
    await rabbit_server.init();

    const channel = await rabbit_server.getPublishChannel();

    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
}

export async function send_Video_Message(queue: string, videoMessageBody: Video_Message_Body_Field) {
    await rabbit_server.init();

    const channel = await rabbit_server.getPublishChannel();

    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(videoMessageBody)), { persistent: true });
}

export async function send_Statistics(queue: string, statistics: Update_Statistics_Body_Field) {
    await rabbit_server.init();

    const channel = await rabbit_server.getPublishChannel();

    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(statistics)), { persistent: true });
}
