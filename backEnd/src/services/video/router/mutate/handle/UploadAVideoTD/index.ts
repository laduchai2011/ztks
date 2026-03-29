import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { MyResponse } from '@src/dataStruct/response';
import { AVideoFileField } from '@src/dataStruct/photo';
import { exec } from 'child_process';
// import { my_log } from '@src/log';

const videoPath = path.join(process.cwd(), 'data', 'video', 'input');
// const imagePath = path.join(process.cwd(), 'data', 'image', 'input');
const imagePath = path.join(process.cwd(), 'data', 'image');
const folderInputPath = path.join(imagePath, 'input');
const folderOutputPath = path.join(imagePath, 'output');

class Handle_UploadAVideoTD {
    constructor() {}

    upload = (): multer.Multer => {
        if (!fs.existsSync(videoPath)) {
            fs.mkdirSync(videoPath, { recursive: true });
        }

        [folderInputPath, folderOutputPath].forEach((dir) => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });

        const storage = multer.diskStorage({
            destination: (_req, _file, cb) => cb(null, videoPath),
            filename: (_req, file, cb) => {
                const ext = path.extname(file.originalname);
                const name = path.basename(file.originalname, ext);
                cb(null, `${name}-${Date.now()}${ext}`);
            },
        });

        const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
            if (file.mimetype.startsWith('video/')) cb(null, true);
            else cb(new Error('Chỉ cho phép file video!'));
        };

        const uploadVideos = multer({
            storage,
            fileFilter,
            limits: { fileSize: 500 * 1024 * 1024 }, // 500MB mỗi file
        });

        return uploadVideos;
    };

    middle_upload = (req: Request, res: Response, next: NextFunction) => {
        const myResponse: MyResponse<unknown> = {
            isSuccess: false,
        };

        if (!req.file) {
            myResponse.message = 'Không có file nào được tải lên';
            res.status(400).json(myResponse);
            return;
        }

        const file = {
            originalName: req.file.originalname,
            savedName: req.file.filename,
            size: req.file.size,
            path: req.file.path,
        };

        const inputVideoPath = path.join(videoPath, file.savedName);
        // const output = path.join(imagePath, `${files[i].savedName}.jpg`);
        const inputImagePath = path.join(folderInputPath, `${file.savedName}.jpg`);
        const outputImagePath = path.join(folderOutputPath, `${file.savedName}.jpg`);
        this.captureFrame(inputVideoPath, inputImagePath, 1)
            .then(() => {
                compressImageFromUrl(inputImagePath, outputImagePath);
            })
            .catch((err) => console.error(err));

        res.locals.file = file;

        next();
    };

    captureFrame = (input: string, output: string, second: number): Promise<void> => {
        return new Promise((resolve, reject) => {
            const cmd = `ffmpeg -ss ${second} -i "${input}" -vframes 1 "${output}" -y`;

            exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    };

    main = async (_: Request, res: Response) => {
        try {
            const file: AVideoFileField = res.locals.file;
            // const { userId, text } = req.body;

            if (!file) {
                res.status(400).json({ error: 'Thiếu files' });
                return;
            }

            const myResponse: MyResponse<AVideoFileField> = {
                message: 'Đăng tải thước phim thành công !',
                isSuccess: true,
                data: file,
            };
            res.json(myResponse);
            return;
        } catch (e: any) {
            console.error(e.response?.data || e);
            res.status(500).json(e.response?.data || e);
            return;
        }
    };
}

async function compressImageFromUrl(inputPath: string, outputPath: string) {
    // Resize và nén ảnh
    await sharp(inputPath)
        .resize({ width: 1024 }) // thay đổi chiều rộng nếu muốn
        .jpeg({ quality: 80 }) // giảm chất lượng jpeg
        .toFile(outputPath);

    // console.log('Ảnh đã nén xong (UploadMulVideos):', outputPath);
}

export default Handle_UploadAVideoTD;
