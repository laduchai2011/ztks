import { minioClient } from './index';
import { Readable } from 'stream';

const BUCKET = 'images';

export class MinioService {
    static async ensureBucket() {
        const exists = await minioClient.bucketExists(BUCKET);
        if (!exists) await minioClient.makeBucket(BUCKET);
    }

    static async stat(objectName: string) {
        return minioClient.statObject(BUCKET, objectName);
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

export class MinioServiceV1 {
    private _bucketName: string = '';

    constructor(bucketName: string) {
        this._bucketName = bucketName;

        // this.ensureBucket().catch((err) => {
        //     console.error('Error ensuring bucket exists:', err);
        // });
    }

    async ensureBucket() {
        const exists = await minioClient.bucketExists(this._bucketName);
        if (!exists) await minioClient.makeBucket(this._bucketName);
    }

    async stat(objectName: string) {
        return minioClient.statObject(this._bucketName, objectName);
    }

    async uploadStream(objectName: string, stream: Readable, size?: number, mimeType?: string) {
        return minioClient.putObject(
            this._bucketName,
            objectName,
            stream,
            size,
            mimeType ? { 'Content-Type': mimeType } : undefined
        );
    }

    getStream(objectName: string) {
        return minioClient.getObject(this._bucketName, objectName);
    }

    getStreamVideo(objectName: string, offset: number, length?: number) {
        return minioClient.getPartialObject(this._bucketName, objectName, offset, length);
    }

    getBucketName() {
        return this._bucketName;
    }

    remove(objectName: string) {
        return minioClient.removeObject(this._bucketName, objectName);
    }
}
