import { Request, Response } from 'express';
import { MinioServiceV1 } from '@src/connect/minio/service';

const minioService = new MinioServiceV1('images');
minioService.ensureBucket().catch((err) => {
    console.error('Error ensuring bucket exists ( images ):', err);
});

export async function getAImageFromMinio(req: Request, res: Response) {
    try {
        const objectName = req.params.name;
        const stat = await minioService.stat(objectName);
        const stream = await minioService.getStream(objectName);

        res.setHeader('Content-Type', stat.metaData['content-type'] || 'image/jpeg');

        // cache 1 năm
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

        // optional: ETag (MinIO có sẵn)
        res.setHeader('ETag', stat.etag);

        stream.pipe(res);
    } catch (error) {
        res.status(204).json(error);
    }
}
