import { Request, Response } from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import { getAccessToken, refreshAccessToken } from '@src/zaloToken';
import { ZaloAppField, ZaloOaField } from '@src/dataStruct/zalo';
import sharp from 'sharp';
import { Readable } from 'stream';

const API_UPLOAD = 'https://openapi.zalo.me/v2.0/oa/upload/image';

class Handle_UploadAImageToZalo {
    constructor() {}

    upload = (): multer.Multer => {
        return multer();
    };

    main = async (req: Request, res: Response) => {
        const file = req.file as Express.Multer.File;
        const zaloApp = JSON.parse(req.body.zaloApp) as ZaloAppField;
        const zaloOa = JSON.parse(req.body.zaloOa) as ZaloOaField;

        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }

        const inputStream = Readable.from(file.buffer);

        const compressedStream = inputStream.pipe(sharp().resize({ width: 1024 }).jpeg({ quality: 80 }));

        const form = new FormData();

        // form.append('file', file.buffer, {
        //     filename: file.originalname,
        //     contentType: file.mimetype,
        // });
        form.append('file', compressedStream, {
            filename: file.originalname,
            contentType: file.mimetype,
        });

        let token: string | undefined = undefined;

        token = await getAccessToken(zaloOa);

        if (!token) {
            token = await refreshAccessToken(zaloApp, zaloOa, 10);
        }

        const response = await axios.post(API_UPLOAD, form, {
            headers: {
                ...form.getHeaders(),
                access_token: token,
            },
        });

        res.json(response.data);
    };
}

export default Handle_UploadAImageToZalo;
