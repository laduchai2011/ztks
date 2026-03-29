import { Request, Response } from 'express';
// import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { MyResponse } from '@src/dataStruct/response';
import sharp from 'sharp';

const uploadsDir = path.join(process.cwd(), 'data', 'image', 'uploads');
// const videoPath = path.join(process.cwd(), 'data', 'image', 'input');
const imagePath = path.join(process.cwd(), 'data', 'image');
const folderInputPath = path.join(imagePath, 'input');
const folderOutputPath = path.join(imagePath, 'output');

class Handle_MergeChunks {
    constructor() {}

    main = async (req: Request, res: Response) => {
        const myResponse: MyResponse<unknown> = {
            isSuccess: false,
            message: 'Khởi tạo Merge Chunks !',
        };

        const { uploadId, filename } = req.body;

        const chunkDir = path.join(uploadsDir, uploadId);
        const files = fs.readdirSync(chunkDir);
        const sorted = files.sort((a, b) => Number(a) - Number(b));

        const inputImagePath = path.join(folderInputPath, filename);
        const writeStream = fs.createWriteStream(inputImagePath);

        for (const chunk of sorted) {
            const chunkPath = path.join(chunkDir, chunk);
            const data = fs.readFileSync(chunkPath);
            // await writeStream.write(data);
            if (!writeStream.write(data)) {
                await new Promise<void>((resolve) => {
                    writeStream.once('drain', () => resolve());
                });
            }
        }

        await new Promise<void>((resolve, reject) => {
            writeStream.end(() => resolve());
            writeStream.on('error', reject);
        });

        // await writeStream.end();

        fs.rmSync(chunkDir, { recursive: true, force: true });

        // const inputImagePath = path.join(folderInputPath, `${filename}.jpg`);
        const outputImagePath = path.join(folderOutputPath, filename);

        try {
            await compressImageFromUrl(inputImagePath, outputImagePath);
            myResponse.message = 'Đăng tải hình ảnh thành công !';
            myResponse.isSuccess = true;
            myResponse.data = { filename: filename };
            res.json(myResponse);
            return;
        } catch (e: any) {
            console.error(e.response?.data || e);
            res.status(500).json(e.response?.data || e);
            return;
        }
    };

    // captureFrame = (input: string, output: string, second: number): Promise<void> => {
    //     return new Promise((resolve, reject) => {
    //         const cmd = `ffmpeg -ss ${second} -i "${input}" -vframes 1 "${output}" -y`;

    //         exec(cmd, (error, stdout, stderr) => {
    //             if (error) {
    //                 reject(error);
    //                 return;
    //             }
    //             resolve();
    //         });
    //     });
    // };
}

async function compressImageFromUrl(inputPath: string, outputPath: string) {
    // Resize và nén ảnh
    await sharp(inputPath)
        .resize({ width: 1024 }) // thay đổi chiều rộng nếu muốn
        .jpeg({ quality: 80 }) // giảm chất lượng jpeg
        .toFile(outputPath);

    // console.log('Ảnh đã nén xong (UploadMulVideos):', outputPath);
}

export default Handle_MergeChunks;
