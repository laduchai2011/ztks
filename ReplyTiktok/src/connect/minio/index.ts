import { Client } from 'minio';

class MinioSingleton {
    private static instance: Client;

    private constructor() {}

    static getInstance(): Client {
        if (!MinioSingleton.instance) {
            MinioSingleton.instance = new Client({
                endPoint: '103.249.200.80',
                port: 9000,
                useSSL: false,
                accessKey: 'minioadmin',
                secretKey: 'minioadmin',
            });
            console.log('✅ MinIO client initialized');
        }
        return MinioSingleton.instance;
    }
}

export const minioClient = MinioSingleton.getInstance();
