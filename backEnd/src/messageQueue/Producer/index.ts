import { rabbit_server } from '@src/connect';
import { MessageZaloField } from '../type';
import { VideoMessageBodyField } from '../../dataStruct/message_v1/body';

rabbit_server.init();

export async function sendMessage(queue: string, messageZalo: MessageZaloField) {
    const channel = await rabbit_server.createChannel();

    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(messageZalo)), { persistent: true });
}

export async function sendHookData(queue: string, hookData: any) {
    const channel = await rabbit_server.createChannel();

    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(hookData)), { persistent: true });
}

export async function sendStringMessage(queue: string, msg: string) {
    const channel = await rabbit_server.createChannel();

    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
}

export async function sendVideoMessage(queue: string, videoMessageBody: VideoMessageBodyField) {
    const channel = await rabbit_server.createChannel();

    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(videoMessageBody)), { persistent: true });
}
