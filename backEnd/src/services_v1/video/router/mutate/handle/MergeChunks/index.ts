import { Request, Response } from 'express';
import { MyResponse } from '@src/dataStruct/response';
import { MinioService } from '@src/connect/minio/service';
import { PassThrough } from 'stream';

class Handle_MergeChunks {
    constructor() {}

    main = async (req: Request, res: Response) => {
        const myResponse: MyResponse<unknown> = {
            isSuccess: false,
            message: 'Khởi tạo Merge Chunks !',
        };

        const { fileId, totalChunks, finalFileName } = req.body;

        if (!fileId || !totalChunks || !finalFileName) {
            res.status(400).json({ message: 'Missing params' });
            return;
        }

        try {
            const finalObjectName = `videos/${finalFileName}`;
            const mergedStream = new PassThrough();
            let totalSize = 0;

            // 1️⃣ TÍNH SIZE TRƯỚC
            for (let i = 0; i < totalChunks; i++) {
                const stat = await MinioService.stat(`chunks/${fileId}/${i}`);
                totalSize += stat.size;
            }

            const uploadPromise = MinioService.uploadStream(finalObjectName, mergedStream, totalSize);

            for (let i = 0; i < totalChunks; i++) {
                const chunkStream = await MinioService.getStream(`chunks/${fileId}/${i}`);

                await new Promise<void>((resolve, reject) => {
                    chunkStream.once('error', reject).once('end', resolve).pipe(mergedStream, { end: false });
                });
            }

            mergedStream.end(); // báo hết dữ liệu
            await uploadPromise;

            // Xóa chunk tạm
            for (let i = 0; i < totalChunks; i++) {
                await MinioService.remove(`chunks/${fileId}/${i}`);
            }

            // setInterval(() => {
            //     console.log('Video MergeChunks:', {
            //         heap: Math.round((process as any).memoryUsage().heapUsed / 1024 / 1024),
            //         handles: (process as any)._getActiveHandles().length,
            //     });
            // }, 5000);

            myResponse.message = 'Đăng tải thước phim thành công !';
            myResponse.isSuccess = true;
            myResponse.data = finalObjectName;
            res.json(myResponse);

            return;
        } catch (error: any) {
            console.error(error.response?.data || error);
            res.status(500).json(error.response?.data || error);
            return;
        }
    };
}

export default Handle_MergeChunks;
