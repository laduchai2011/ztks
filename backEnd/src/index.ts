import express, { Express } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import process from 'process';
import cors from 'cors';
import { mssql_server } from '@src/connect';
import { redis_server } from '@src/connect';
import { rabbit_server } from '@src/connect';
import ServiceRedis from '@src/cache/cacheRedis';
import { connectMongo } from './connect/mongo';
import { getEnv } from './mode';
import { myEnv } from './mode/type';

dotenv.config();

const services = (process.env.SERVICES ?? '').split(',').map((s) => s.trim());

const app: Express = express();

const isProduct = process.env.NODE_ENV === 'production';
const port = isProduct ? process.env.PORT : 4000;

const apiString = isProduct ? '' : '/api';
const prefix = getEnv() === myEnv.Dev ? '/api' : '';

app.use(cookieParser());
app.use(apiString, express.json());
app.use(apiString, express.urlencoded({ extended: true }));

const originArray: string[] = [
    'http://zalo5k.local.com:3000',
    'http://zalo5k.local.com:3001',
    'http://zalo5k.local.com:3002',
];
app.use(
    cors({
        origin: originArray,
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true,
    })
);

app.use(`${apiString}/hello`, (req, res) => {
    res.send('hello');
});

(async () => {
    await mssql_server.init();
    await redis_server.init();
    await rabbit_server.init();

    const serviceRedis = ServiceRedis.getInstance();
    await serviceRedis.init();

    await connectMongo();

    if (services.includes('image')) {
        // const service_image = (await import('./services/image')).default;
        // app.use(`${prefix}/service_image`, service_image);
        const service_image_v1 = (await import('./services/image_v1')).default;
        app.use(`${prefix}/service_image_v1`, service_image_v1);
    }

    if (services.includes('video')) {
        const service_video = (await import('./services/video')).default;
        app.use(`${prefix}/service_video`, service_video);
        const service_video_v1 = (await import('./services/video_v1')).default;
        app.use(`${prefix}/service_video_v1`, service_video_v1);
    }

    if (services.includes('account')) {
        const service_account = (await import('@src/services/account')).default;
        app.use(`${prefix}/service_account`, service_account);
    }

    if (services.includes('message')) {
        const service_message_v1 = (await import('./services/message_v1')).default;
        app.use(`${prefix}/service_message_v1`, service_message_v1);
        const hookData = (await import('./services/message_v1/hookData')).hookData;
        hookData();
    }

    if (services.includes('note')) {
        const service_note = (await import('@src/services/note')).default;
        app.use(`${prefix}/service_note`, service_note);
    }

    if (services.includes('zalo')) {
        const service_zalo = (await import('@src/services/zalo')).default;
        app.use(`${prefix}/service_zalo`, service_zalo);
    }

    if (services.includes('chatSession')) {
        const service_chatSession = (await import('@src/services/chatSession')).default;
        app.use(`${prefix}/service_chatSession`, service_chatSession);
    }

    if (services.includes('chatRoom')) {
        const service_chatRoom = (await import('@src/services/chatRoom')).default;
        app.use(`${prefix}/service_chatRoom`, service_chatRoom);
    }

    if (services.includes('order')) {
        const service_order = (await import('@src/services/order')).default;
        app.use(`${prefix}/service_order`, service_order);
    }

    if (services.includes('agent')) {
        const service_agent = (await import('@src/services/agent')).default;
        app.use(`${prefix}/service_agent`, service_agent);
    }

    if (services.includes('wallet')) {
        const service_wallet = (await import('@src/services/wallet')).default;
        app.use(`${prefix}/service_wallet`, service_wallet);
    }

    if (services.includes('voucher')) {
        const service_voucher = (await import('@src/services/voucher')).default;
        app.use(`${prefix}/service_voucher`, service_voucher);
    }

    if (services.includes('customer')) {
        const service_customer = (await import('@src/services/customer')).default;
        app.use(`${prefix}/service_customer`, service_customer);
    }

    if (services.includes('bank')) {
        const service_bank = (await import('@src/services/bank')).default;
        app.use(`${prefix}/service_bank`, service_bank);
    }
})();

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
