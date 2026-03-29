// import { Request, Response } from 'express';
// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';
// import { MyResponse } from '@src/dataStruct/response';

// const uploadsDir = path.join(process.cwd(), 'data', 'video', 'uploads');

// class Handle_UploadChunk {
//     constructor() {}

//     upload = (): multer.Multer => {
//         const upload = multer({ dest: 'temp/' });

//         return upload;
//     };

//     main = (req: Request, res: Response) => {
//         const myResponse: MyResponse<unknown> = {
//             isSuccess: false,
//             message: 'Khởi tạo upload chunk !',
//         };

//         const { index, uploadId } = req.body;

//         const chunkDir = path.join(uploadsDir, uploadId);
//         if (!fs.existsSync(chunkDir)) {
//             fs.mkdirSync(chunkDir, { recursive: true });
//         }

//         try {
//             if (!req.file) {
//                 res.status(400).json({ error: 'No chunk uploaded' });
//                 return;
//             }
//             const filePath = path.join(chunkDir, index);
//             // fs.renameSync(req.file.path, filePath);
//             fs.copyFileSync(req.file.path, filePath);
//             fs.unlinkSync(req.file.path);

//             myResponse.message = 'Đăng tải những mẩu thước phim thành công !';
//             myResponse.isSuccess = true;
//             res.json(myResponse);
//             return;
//         } catch (error: any) {
//             console.error(error.response?.data || error);
//             res.status(500).json(error.response?.data || error);
//             return;
//         }
//     };
// }

// export default Handle_UploadChunk;

import { Request, Response } from 'express';
import multer from 'multer';
import { MinioService } from '@src/connect/minio/service';
import { MyResponse } from '@src/dataStruct/response';
import fs from 'fs';

const CHUNK_SIZE = 5 * 1024 * 1024;
class Handle_UploadChunk {
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

    main = async (req: Request, res: Response) => {
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

            // stream.on('close', () => console.log('stream closed'));
            // stream.on('error', err => console.log('stream error', err));

            const result = await MinioService.uploadStream(objectName, stream, req.file.size, req.file.mimetype);

            // 🔥 xoá file tạm
            // fs.unlinkSync(filePath);
            await fs.promises.unlink(filePath);

            // setInterval(() => {
            //     console.log('Video UploadChunks:', {
            //         heap: Math.round((process as any).memoryUsage().heapUsed / 1024 / 1024),
            //         handles: (process as any)._getActiveHandles().length,
            //     });
            // }, 5000);

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
}

export default Handle_UploadChunk;
