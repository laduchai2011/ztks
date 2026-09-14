import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';

class Handle_UploadAImage {
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
        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }
        res.json({ file: req.file.filename });
    };
}

export default Handle_UploadAImage;
