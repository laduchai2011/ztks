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

export async function get_A_Video_From_Minio(req: Request, res: Response) {
    try {
        const file_name = req.params.name;

        const stat = await minioService.stat(file_name);
        const file_size = stat.size;

        const range = req.headers.range;

        const content_type = mime.lookup(file_name) || 'video/mp4';

        if (range) {
            const parts = range.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : file_size - 1;

            const chunk_size = end - start + 1;

            const stream = await minioService.getStreamVideo(file_name, start, chunk_size);

            res.writeHead(206, {
                'Content-Range': `bytes ${start}-${end}/${file_size}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunk_size,
                'Content-Type': content_type,
            });

            stream.pipe(res);
        } else {
            const stream = await minioService.getStream(file_name);

            res.writeHead(200, {
                'Content-Length': file_size,
                'Content-Type': content_type,
            });

            stream.pipe(res);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error streaming video');
    }
}

export async function download_Video_From_Minio(req: Request, res: Response) {
    try {
        const file_name = req.params.name;

        const stat = await minioService.stat(file_name);
        const content_type = mime.lookup(file_name) || 'video/mp4';

        const stream = await minioService.getStream(file_name);

        // // ✅ CORS (QUAN TRỌNG NHẤT)
        // res.setHeader('Access-Control-Allow-Origin', 'https://oa.zalo.me');
        // res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range');

        res.setHeader('Content-Type', content_type);
        res.setHeader('Content-Length', stat.size);

        // QUAN TRỌNG: để browser/extension hiểu là download
        res.setHeader('Content-Disposition', `attachment; filename="${file_name}"`);

        stream.pipe(res);
    } catch (err) {
        console.error(err);
        res.status(500).send('Download error');
    }
}
