import { rabbit_server } from '@src/connect';
import { MessageZaloField } from '../type';
import { SendVideoBodyField } from '@src/dataStruct/video';

export async function sendMessage(queue: string, messageZalo: MessageZaloField) {
    await rabbit_server.init();
    const channel = await rabbit_server.createChannel();

    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(messageZalo)), { persistent: true });
}

export async function sendMessageVideo(queue: string, sendVideoBody: SendVideoBodyField) {
    await rabbit_server.init();
    const channel = await rabbit_server.createChannel();

    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(sendVideoBody)), { persistent: true });
}
