import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { MyResponse } from '@src/dataStruct/response';
import { parameter_options } from '../../type';

const root_path = process.cwd();

const applyCORS = (
    req: Request | Request<Record<string, never>, unknown, unknown, parameter_options>,
    res: Response
) => {
    const allowedOrigins = ['http://shopm.local.com:3000'];
    const origin = req.headers.origin as string;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
};

class Handle_Watch {
    constructor() {}

    main_segment = (req: Request, res: Response) => {
        applyCORS(req, res);

        const myResponse: MyResponse<unknown> = {
            message: 'middle_upload have a error',
            isSuccess: false,
        };

        try {
            const { folder } = req.params;
            const filePath = path.join(root_path, 'data', 'video', 'output', folder);
            res.setHeader('Content-Type', 'video/MP2T');
            fs.createReadStream(filePath).pipe(res);
        } catch (err) {
            myResponse.message = 'Segment not found !';
            myResponse.err = err;
            res.status(404).send(myResponse);
            return;
        }
    };

    main_playlist = (req: Request, res: Response) => {
        applyCORS(req, res);

        const myResponse: MyResponse<unknown> = {
            message: 'middle_upload have a error',
            isSuccess: false,
        };

        try {
            const { folder, file } = req.params;
            const filePath = path.join(root_path, 'data', 'video', 'output', folder, file);
            res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
            fs.createReadStream(filePath).pipe(res);
        } catch (err) {
            myResponse.message = `Playlist (${req.path}) not found !`;
            myResponse.err = err;
            res.status(404).send(myResponse);
            return;
        }
    };

    main = async (req: Request<Record<string, never>, unknown, unknown, parameter_options>, res: Response) => {
        applyCORS(req, res);

        const myResponse: MyResponse<unknown> = {
            message: 'middle_upload have a error',
            isSuccess: false,
        };

        try {
            const { folder, file } = req.params;
            const filePath = path.join(root_path, 'data', 'video', 'output', folder, file);
            const stat = fs.statSync(filePath);
            res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            res.setHeader('Content-Length', stat.size);
            res.sendFile(filePath);
            return;
        } catch (err) {
            myResponse.message = `Master.m3u8 (${req.path}) not found !`;
            myResponse.err = err;
            res.status(404).send(myResponse);
            return;
        }
    };
}

export default Handle_Watch;
