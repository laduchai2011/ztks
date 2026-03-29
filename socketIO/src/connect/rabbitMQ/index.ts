import { connect } from 'amqplib';
import type { Connection, Channel } from '@src/types/amqp';
import { my_log } from '@src/log';
import { rabbitmq_config } from '@src/config';

export class RabbitMQ {
    private static instance: RabbitMQ;

    private connection!: Connection;
    private initPromise: Promise<void> | null = null;

    private constructor() {}

    static getInstance(): RabbitMQ {
        if (!RabbitMQ.instance) {
            RabbitMQ.instance = new RabbitMQ();
        }
        return RabbitMQ.instance;
    }

    async init(): Promise<void> {
        if (this.initPromise) return this.initPromise;

        this.initPromise = new Promise((resolve, reject) => {
            this.connect().then(resolve).catch(reject);
        });

        return this.initPromise;
    }

    private async connect(): Promise<void> {
        const url = `amqp://${rabbitmq_config?.username}:${rabbitmq_config?.password}@${rabbitmq_config?.host}:${rabbitmq_config?.port}`;

        const conn: Connection = await connect(url);
        this.connection = conn;

        my_log.withGreen('RabbitMQ connected (1 connection only).');

        // Tự reconnect khi connection bị đóng
        this.connection.on('close', () => {
            console.warn('RabbitMQ connection closed → reconnecting...');
            this.initPromise = null;
            this.init();
        });
    }

    /**
     * 🔥 Quan trọng: tạo channel mới bất kỳ khi bạn muốn
     */
    public async createChannel(): Promise<Channel> {
        if (!this.connection) {
            throw new Error('RabbitMQ chưa init! Hãy gọi await RabbitMQ.getInstance().init()');
        }

        const ch = await this.connection.createChannel();
        return ch;
    }

    /**
     * Optional: tạo 1 channel publish chung
     */
    private publishChannel: Channel | null = null;

    public async getPublishChannel(): Promise<Channel> {
        if (!this.publishChannel) {
            this.publishChannel = await this.createChannel();
        }
        return this.publishChannel;
    }

    /**
     * Optional: tạo channel theo tên queue cho consumer
     */
    private consumerChannels = new Map<string, Channel>();

    public async getConsumerChannel(queue: string): Promise<Channel> {
        if (!this.consumerChannels.has(queue)) {
            const ch = await this.createChannel();
            this.consumerChannels.set(queue, ch);
        }
        return this.consumerChannels.get(queue)!;
    }

    async close(): Promise<void> {
        if (this.connection) {
            await this.connection.close();
            my_log.withYellow('RabbitMQ connection closed.');
        }
    }
}
