import { minioClient } from './index';
import { Readable } from 'stream';

const BUCKET = 'videos';

export class MinioService {
    static async ensureBucket() {
        const exists = await minioClient.bucketExists(BUCKET);
        if (!exists) await minioClient.makeBucket(BUCKET);
    }

    static async stat(objectName: string) {
        return minioClient.statObject(
            BUCKET,
            objectName
        );
    }

    static uploadStream(objectName: string, stream: Readable, size?: number, mimeType?: string) {
        return minioClient.putObject(
            BUCKET,
            objectName,
            stream,
            size,
            mimeType ? { 'Content-Type': mimeType } : undefined
        );
    }

    static getStream(objectName: string) {
        return minioClient.getObject(BUCKET, objectName);
    }

    static remove(objectName: string) {
        return minioClient.removeObject(BUCKET, objectName);
    }
}
