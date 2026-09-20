import { Request, Response } from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import { get_Access_Token, refresh_Access_Token } from '@src/zaloToken';
import { Zalo_App_Field, Zalo_Oa_Field } from '@src/data_struct/zalo';
import sharp from 'sharp';
import { Readable } from 'stream';

const API_UPLOAD = 'https://openapi.zalo.me/v2.0/oa/upload/image';

class Handle_Upload_A_Image_To_Zalo {
    upload = (): multer.Multer => {
        return multer();
    };

    main = async (req: Request, res: Response) => {
        const file = req.file as Express.Multer.File;
        const zalo_app = JSON.parse(req.body.zalo_app) as Zalo_App_Field;
        const zalo_oa = JSON.parse(req.body.zalo_oa) as Zalo_Oa_Field;

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

        token = await get_Access_Token(zalo_oa);

        if (!token) {
            token = await refresh_Access_Token(zalo_app, zalo_oa, 10);
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

export default Handle_Upload_A_Image_To_Zalo;
