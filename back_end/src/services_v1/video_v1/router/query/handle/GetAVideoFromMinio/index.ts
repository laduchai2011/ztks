import { Request, Response } from 'express';
import { MinioServiceV1 } from '@src/connect/minio/service';
import mime from 'mime-types';

const minioService = new MinioServiceV1('videos-to-send-zalo');
minioService.ensureBucket().catch((err) => {
    console.error('Error ensuring bucket exists ( videos-to-send-zalo ):', err);
});

// export async function getAVideoFromMinio(req: Request, res: Response) {
//     const stream = await minioService.getStream(req.params.name);
//     stream.pipe(res);
// }

export async function getAVideoFromMinio(req: Request, res: Response) {
    try {
        const fileName = req.params.name;

        const stat = await minioService.stat(fileName);
        const fileSize = stat.size;

        const range = req.headers.range;

        const contentType = mime.lookup(fileName) || 'video/mp4';

        if (range) {
            const parts = range.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

            const chunkSize = end - start + 1;

            const stream = await minioService.getStreamVideo(fileName, start, chunkSize);

            res.writeHead(206, {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunkSize,
                'Content-Type': contentType,
            });

            stream.pipe(res);
        } else {
            const stream = await minioService.getStream(fileName);

            res.writeHead(200, {
                'Content-Length': fileSize,
                'Content-Type': contentType,
            });

            stream.pipe(res);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error streaming video');
    }
}

export async function downloadVideoFromMinio(req: Request, res: Response) {
    try {
        const fileName = req.params.name;

        const stat = await minioService.stat(fileName);
        const contentType = mime.lookup(fileName) || 'video/mp4';

        const stream = await minioService.getStream(fileName);

        // // ✅ CORS (QUAN TRỌNG NHẤT)
        // res.setHeader('Access-Control-Allow-Origin', 'https://oa.zalo.me');
        // res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range');

        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Length', stat.size);

        // QUAN TRỌNG: để browser/extension hiểu là download
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        stream.pipe(res);
    } catch (err) {
        console.error(err);
        res.status(500).send('Download error');
    }
}
