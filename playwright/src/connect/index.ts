import dotenv from 'dotenv';
import { RabbitMQ } from '@src/connect/rabbitMQ';

dotenv.config();

const NODE_ENV = process.env.NODE_ENV;

const isProduct = NODE_ENV === 'production';

const rabbit_server = RabbitMQ.getInstance();

const shutdown = async (signal: string) => {
    try {
        console.log(`Received ${signal}. Closing Redis...`);
        await rabbit_server.close();
        console.log('Redis closed. Exiting now.');
    } catch (err) {
        console.error('Error during shutdown:', err);
    } finally {
        process.exit(0);
    }
};

if (isProduct) {
    process.on('SIGTERM', () => shutdown('SIGTERM')); // khi docker stop
} else {
    process.on('SIGINT', () => shutdown('SIGINT')); // khi nhấn Ctrl+C
}

export { rabbit_server };
