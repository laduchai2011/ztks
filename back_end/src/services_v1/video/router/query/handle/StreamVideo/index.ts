import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { parameter_options } from '../../type';

const root_path = process.cwd();

export function streamVideo(req: Request<Record<string, never>, unknown, unknown, parameter_options>, res: Response) {
    const id = req.query.id;
    if (!id) {
        res.status(400).send('Missing video id');
        return;
    }

    const videoPath = path.join(root_path, 'data', 'video', 'input', id);

    // Check if file exists
    if (!fs.existsSync(videoPath)) {
        res.status(404).send('Video not found');
        return;
    }

    const videoSize = fs.statSync(videoPath).size;
    const range = req.headers.range;

    let start = 0;
    let end = videoSize - 1;

    if (range) {
        // Parse range: "bytes=start-end"
        const parts = range.replace(/bytes=/, '').split('-');
        start = parseInt(parts[0], 10);
        end = parts[1] ? parseInt(parts[1], 10) : end;

        // Boundaries
        const CHUNK_SIZE = 1 * 1024 * 1024; // 1MB
        end = Math.min(end, start + CHUNK_SIZE, videoSize - 1);

        const contentLength = end - start + 1;
        const headers = {
            'Content-Range': `bytes ${start}-${end}/${videoSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': contentLength,
            'Content-Type': 'video/mp4',
        };

        res.writeHead(206, headers); // Partial Content
    } else {
        // Full video
        const headers = {
            'Content-Length': videoSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, headers);
    }

    fs.createReadStream(videoPath, { start, end }).pipe(res);
}
