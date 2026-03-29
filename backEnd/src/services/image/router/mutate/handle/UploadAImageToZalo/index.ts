import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { getAccessToken, refreshAccessToken } from '@src/services/zalo_webhook/handle/TokenZaloOA';
import { ZaloOaAImageField } from '@src/dataStruct/photo';
import { my_log } from '@src/log';
// import { MyResponse } from '@src/dataStruct/response';

const API_UPLOAD = 'https://openapi.zalo.me/v2.0/oa/upload/image';
const API_SEND = 'https://openapi.zalo.me/v3.0/oa/message/cs';

class Handle_UploadAImageToZalo {
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
                const ext = path.extname(file.originalname);
                cb(null, `${userId}_${timestamp}${ext}`);
            },
        });
        const upload = multer({ storage });

        return upload;
    };

    main = async (req: Request, res: Response) => {
        // if (!req.file) {
        //     res.status(400).json({ message: 'No file uploaded' });
        //     return;
        // }
        // res.json({ file: req.file.filename });

        try {
            const file = req.file as Express.Multer.File;
            if (!req.file) {
                res.status(400).json({ message: 'No file uploaded' });
                return;
            }

            const uploadRes: ZaloOaAImageField = await uploadToZalo(file.path);
            const sendRes = await sendImage('5324785107455488962', uploadRes.data.attachment_id, 'gui hinh anh');
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

    const res: any = await axios.post(`${API_UPLOAD}`, form, {
        headers: {
            ...form.getHeaders(),
            access_token: token,
        },
    });

    console.log('res', res.data);
    if (res?.data.error !== 0) {
        const newToken = await refreshAccessToken({ repeat: 5 });
        const res1: any = await axios.post(`${API_UPLOAD}`, form, {
            // headers: form.getHeaders(),
            headers: {
                ...form.getHeaders(),
                access_token: newToken,
            },
        });
        console.log('res1', res.data);
        return res1.data as ZaloOaAImageField;
    }

    return res.data as ZaloOaAImageField;
}

// -------------- Gửi tin nhắn hình ảnh --------------
async function sendImage(userId: string, attachmentId: string, text?: string) {
    const body = {
        recipient: { user_id: userId },
        message: {
            text: 'Zalo đạt 100 triệu người dùng',
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'media',
                    elements: [
                        {
                            media_type: 'image',
                            url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlnhFBNw9Io0hHvtv8QzH_euzwGbRJv_IC9A&s',
                        },
                    ],
                },
            },
        },
    };

    const token = await getAccessToken();

    const res = await axios.post(`${API_SEND}`, body, {
        headers: {
            'Content-Type': 'application/json',
            access_token: token,
        },
    });

    return res.data;
}

export default Handle_UploadAImageToZalo;
