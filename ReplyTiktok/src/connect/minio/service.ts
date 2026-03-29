import { minioClient } from './index';
import { Readable } from 'stream';
import fs from 'fs';
import { pipeline } from 'stream/promises';

const BUCKET = 'videos';

export class MinioService {
    static async ensureBucket() {
        const exists = await minioClient.bucketExists(BUCKET);
        if (!exists) await minioClient.makeBucket(BUCKET);
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

export async function downloadVideo(objectName: string, destPath: string) {
    try {
        const dataStream = await minioClient.getObject(BUCKET, objectName);
        const file = fs.createWriteStream(destPath);

        // Dùng pipeline để quản lý stream tốt hơn
        await pipeline(dataStream, file);

        console.log('Video đã được tải xong!');
    } catch (err) {
        console.error('Lỗi khi tải video:', err);
        throw err;
    }
}

export async function deleteVideo(bucket: string, objectName: string): Promise<void> {
    await minioClient.removeObject(bucket, objectName);
}
