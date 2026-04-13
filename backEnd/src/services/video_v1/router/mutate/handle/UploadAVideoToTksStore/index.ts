import { Request, Response } from 'express';
import multer from 'multer';
import { PassThrough } from 'stream';
import { MinioServiceV1 } from '@src/connect/minio/service';
import { MyResponse } from '@src/dataStruct/response';
import fs from 'fs';

const CHUNK_SIZE = 5 * 1024 * 1024;

const minioService = new MinioServiceV1('videos-to-send-zalo');
minioService.ensureBucket().catch((err) => {
    console.error('Error ensuring bucket exists ( videos ):', err);
});

class Handle_UploadAVideoToTksStore {
    constructor() {}

    upload = (): multer.Multer => {
        const storage = multer.diskStorage({
            destination: 'tmp/chunks',
        });
        const upload = multer({
            storage,
            limits: { fileSize: CHUNK_SIZE }, // giới hạn size
        });

        return upload;
    };

    uploadChunk = async (req: Request, res: Response) => {
        const myResponse: MyResponse<unknown> = {
            isSuccess: false,
            message: 'Khởi tạo upload chunk !',
        };

        // let stream: fs.ReadStream | null = null;

        try {
            if (!req.file) {
                res.status(400).json({ message: 'No chunk uploaded' });
                return;
            }

            const { fileId, chunkIndex } = req.body;

            if (!fileId || chunkIndex === undefined) {
                res.status(400).json({ message: 'Missing params' });
                return;
            }

            const index = Number(chunkIndex);
            if (!Number.isInteger(index) || index < 0) {
                res.status(400).json({ message: 'Invalid chunkIndex' });
                return;
            }

            const filePath = req.file.path;
            const objectName = `chunks/${fileId}/${index}`;

            const stream = fs.createReadStream(filePath);

            const result = await minioService.uploadStream(objectName, stream, req.file.size, req.file.mimetype);

            // 🔥 xoá file tạm
            // fs.unlinkSync(filePath);
            await fs.promises.unlink(filePath);

            myResponse.isSuccess = true;
            myResponse.message = 'Upload chunk thành công';
            myResponse.data = {
                chunkIndex: index,
                etag: result.etag,
            };

            res.json(myResponse);
            return;
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Upload chunk failed' });
            return;
        }
    };

    mergeChunks = async (req: Request, res: Response) => {
        const { fileId, totalChunks, finalFileName } = req.body;

        const myResponse: MyResponse<unknown> = {
            isSuccess: false,
            message: 'Khởi tạo Merge Chunks !',
        };

        if (!fileId || !totalChunks || !finalFileName) {
            res.status(400).json({ message: 'Missing params' });
            return;
        }

        const finalObjectName = `${finalFileName}`;
        const mergedStream = new PassThrough();

        try {
            // 🚀 1. TÍNH SIZE SONG SONG
            const stats = await Promise.all(
                Array.from({ length: totalChunks }, (_, i) => minioService.stat(`chunks/${fileId}/${i}`))
            );

            const totalSize = stats.reduce((sum, s) => sum + s.size, 0);

            // 🚀 2. upload ngay
            const uploadPromise = minioService.uploadStream(finalObjectName, mergedStream, totalSize);

            // 🚀 3. merge chunk bằng pipeline (an toàn)
            for (let i = 0; i < totalChunks; i++) {
                const objectName = `chunks/${fileId}/${i}`;
                const chunkStream = await minioService.getStream(objectName);

                await new Promise<void>((resolve, reject) => {
                    chunkStream.once('error', reject).once('end', resolve).pipe(mergedStream, { end: false });
                });
            }

            // kết thúc stream
            mergedStream.end();

            // chờ upload hoàn tất
            await uploadPromise;

            // 🚀 4. cleanup song song
            await Promise.all(
                Array.from({ length: totalChunks }, (_, i) => minioService.remove(`chunks/${fileId}/${i}`))
            );

            myResponse.message = 'Đăng tải thước phim thành công !';
            myResponse.isSuccess = true;
            myResponse.data = finalObjectName;
            res.json(myResponse);
            return;
        } catch (error: any) {
            console.error(error);

            // ❗ cleanup nếu fail
            await Promise.allSettled(
                Array.from({ length: totalChunks }, (_, i) => minioService.remove(`chunks/${fileId}/${i}`))
            );

            console.error(error.response?.data || error);
            res.status(500).json(error.response?.data || error);
            return;
        }
    };
}

export default Handle_UploadAVideoToTksStore;
