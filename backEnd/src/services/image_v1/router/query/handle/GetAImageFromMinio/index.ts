import { Request, Response } from 'express';
import { MinioServiceV1 } from '@src/connect/minio/service';

const minioService = new MinioServiceV1('images');
minioService.ensureBucket().catch((err) => {
    console.error('Error ensuring bucket exists ( images ):', err);
});

export async function getAImageFromMinio(req: Request, res: Response) {
    const stream = await minioService.getStream(req.params.name);
    stream.pipe(res);
}
