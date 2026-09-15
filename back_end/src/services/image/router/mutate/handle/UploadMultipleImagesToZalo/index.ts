import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { ZaloOaAImageField } from '@src/dataStruct/photo';
import { my_log } from '@src/log';
// import { MyResponse } from '@src/dataStruct/response';
import { getAccessToken, refreshAccessToken } from '@src/services/zalo_webhook/handle/TokenZaloOA';

// const OA_ACCESS_TOKEN = process.env.ZALO_OA_ACCESS_TOKEN!;
const API_UPLOAD = 'https://openapi.zalo.me/v2.0/oa/upload/image';
const API_SEND = 'https://openapi.zalo.me/v3.0/oa/message/cs';

class Handle_UploadMultipleImagesToZalo {
    constructor() {}

    upload = (): multer.Multer => {
        const imagePath = path.join(process.cwd(), 'data', 'image');
        if (!fs.existsSync(imagePath)) {
            fs.mkdirSync(imagePath, { recursive: true });
        }

        const storage = multer.diskStorage({
            destination: (_req, _file, cb) => {
                cb(null, imagePath);
            },
            filename: (req, file, cb) => {
                const userId = req.cookies?.id || 'unknown';
                const timestamp = Date.now();
                const randomSuffix = Math.round(Math.random() * 1e6);
                const ext = path.extname(file.originalname);
                cb(null, `${userId}_${timestamp}_${randomSuffix}${ext}`);
            },
        });

        const upload = multer({
            storage,
            limits: {
                fileSize: 10 * 1024 * 1024, // giới hạn 10MB mỗi ảnh
            },
            fileFilter: (_req, file, cb) => {
                if (!file.mimetype.startsWith('image/')) {
                    return cb(new Error('Only image files are allowed!'));
                }
                cb(null, true);
            },
        });

        return upload;
    };

    main = async (req: Request, res: Response) => {
        // const myResponse: MyResponse<ZaloOaAImageField[]> = {
        //     isSuccess: false,
        // };

        try {
            const files = req.files as Express.Multer.File[];
            const { userId, text } = req.body;

            if (!files || files.length === 0) {
                res.status(400).json({ error: 'Thiếu files' });
                return;
            }

            const results: any[] = [];

            // Lặp từng file
            for (const file of files) {
                // 1. Upload lên Zalo
                const uploadRes: ZaloOaAImageField = await uploadToZalo(file.path);

                // const attachmentId = uploadRes?.data?.attachment_id || uploadRes?.attachment_id || uploadRes?.data?.id;
                const attachmentId = uploadRes?.data?.attachment_id;

                if (!attachmentId) {
                    // results.push({ file: file.originalname, error: 'Không lấy được attachment_id' });
                    my_log.withYellow('Không lấy được attachment_id');
                    continue;
                }

                // 2. Gửi tin nhắn ảnh
                const sendRes = await sendImage(userId, attachmentId, text);

                results.push({
                    file: file.originalname,
                    upload: uploadRes,
                    send: sendRes,
                });

                console.log(555555555, results);

                // Xóa file tạm
                fs.unlinkSync(file.path);
            }

            res.json({ results });
            return;
        } catch (e: any) {
            console.error(e.response?.data || e);
            res.status(500).json(e.response?.data || e);
            return;
        }
    };
}

// -------------- Upload ảnh lên Zalo OA --------------
async function uploadToZalo(filePath: string) {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    const token = await getAccessToken();

    const res: any = await axios.post(`${API_UPLOAD}?access_token=${token}`, form, {
        headers: form.getHeaders(),
    });

    my_log.withMagenta(res);
    if (res?.error !== 0) {
        const newToken = await refreshAccessToken({ repeat: 5 });
        const res1: any = await axios.post(`${API_UPLOAD}?access_token=${newToken}`, form, {
            headers: form.getHeaders(),
        });
        return res1.data as ZaloOaAImageField;
    }

    return res.data as ZaloOaAImageField;
}

// -------------- Gửi tin nhắn hình ảnh --------------
async function sendImage(userId: string, attachmentId: string, text?: string) {
    const body = {
        recipient: { user_id: userId },
        message: {
            text: text || '',
            attachment: {
                type: 'image',
                payload: { attachment_id: attachmentId },
            },
        },
    };

    const token = await getAccessToken();

    const res = await axios.post(`${API_SEND}?access_token=${token}`, body, {
        headers: { 'Content-Type': 'application/json' },
    });

    return res.data;
}

export default Handle_UploadMultipleImagesToZalo;
