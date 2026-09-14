import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { AImageFileField } from '@src/dataStruct/photo';
import { MyResponse } from '@src/dataStruct/response';
import sharp from 'sharp';

const imagePath = path.join(process.cwd(), 'data', 'image');
const folderInputPath = path.join(imagePath, 'input');
const folderOutputPath = path.join(imagePath, 'output');

class Handle_UploadMultipleImages {
    constructor() {}

    upload = (): multer.Multer => {
        [folderInputPath, folderOutputPath].forEach((dir) => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });

        const storage = multer.diskStorage({
            destination: (_req, _file, cb) => {
                cb(null, folderInputPath);
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

    main = (req: Request, res: Response) => {
        const files = req.files as Express.Multer.File[] | undefined;

        if (!files || files.length === 0) {
            res.status(400).json({ message: 'No files uploaded' });
            return;
        }

        const fileInfos: AImageFileField[] = files.map((file) => ({
            filename: file.filename,
            path: `/${file.filename}`, // nếu bạn phục vụ static
            size: file.size,
            mimetype: file.mimetype,
        }));

        for (let i: number = 0; i < fileInfos.length; i++) {
            const inputPath = path.join(folderInputPath, fileInfos[i].filename);
            const outputPath = path.join(folderOutputPath, fileInfos[i].filename);
            const stats = fs.statSync(inputPath);
            const fileSizeInBytes = stats.size;
            if (fileSizeInBytes > 1024 * 1024) {
                compressImageFromUrl(inputPath, outputPath);
            }
        }

        const resData: MyResponse<AImageFileField[]> = {
            message: 'Đăng tải những hình ảnh thành công !',
            isSuccess: true,
            data: fileInfos,
        };

        res.json(resData);
        return;
    };
}

async function compressImageFromUrl(inputPath: string, outputPath: string) {
    // Resize và nén ảnh
    await sharp(inputPath)
        .resize({ width: 1024 }) // thay đổi chiều rộng nếu muốn
        .jpeg({ quality: 80 }) // giảm chất lượng jpeg
        .toFile(outputPath);

    console.log('Ảnh đã nén xong:', outputPath);
}

export default Handle_UploadMultipleImages;
