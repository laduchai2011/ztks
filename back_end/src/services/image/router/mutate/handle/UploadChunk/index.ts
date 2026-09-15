import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { MyResponse } from '@src/dataStruct/response';

const uploadsDir = path.join(process.cwd(), 'data', 'image', 'uploads');

class Handle_UploadChunk {
    constructor() {}

    upload = (): multer.Multer => {
        const upload = multer({ dest: 'temp/' });

        return upload;
    };

    main = (req: Request, res: Response) => {
        const myResponse: MyResponse<unknown> = {
            isSuccess: false,
            message: 'Khởi tạo upload chunk !',
        };

        const { index, uploadId } = req.body;

        const chunkDir = path.join(uploadsDir, uploadId);
        if (!fs.existsSync(chunkDir)) {
            fs.mkdirSync(chunkDir, { recursive: true });
        }

        try {
            if (!req.file) {
                res.status(400).json({ error: 'No chunk uploaded' });
                return;
            }
            const filePath = path.join(chunkDir, index);
            // fs.renameSync(req.file.path, filePath);
            fs.copyFileSync(req.file.path, filePath);
            fs.unlinkSync(req.file.path);

            myResponse.message = 'Đăng tải những mẩu hình ảnh thành công !';
            myResponse.isSuccess = true;
            res.json(myResponse);
            return;
        } catch (error: any) {
            console.error(error.response?.data || error);
            res.status(500).json(error.response?.data || error);
            return;
        }
    };
}

export default Handle_UploadChunk;
