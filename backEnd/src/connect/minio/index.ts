import { Client } from 'minio';
import { minio_config } from '@src/config';

class MinioSingleton {
    private static instance: Client;

    private constructor() {}

    static getInstance(): Client {
        if (!MinioSingleton.instance) {
            MinioSingleton.instance = new Client({
                endPoint: minio_config?.endPoint || '',
                port: minio_config?.port || 9000,
                useSSL: minio_config?.useSSL || false,
                accessKey: minio_config?.accessKey || '',
                secretKey: minio_config?.secretKey || '',
            });
            console.log('✅ MinIO client initialized');
        }
        return MinioSingleton.instance;
    }
}

export const minioClient = MinioSingleton.getInstance();
