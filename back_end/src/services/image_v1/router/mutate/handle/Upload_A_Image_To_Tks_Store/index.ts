import { Request, Response } from 'express';
import multer from 'multer';
import { PassThrough } from 'stream';
import { MinioServiceV1 } from '@src/connect/minio/service';
import { My_Response_Field } from '@src/data_struct/response';
import fs from 'fs';

const CHUNK_SIZE = 5 * 1024 * 1024;

const minioService = new MinioServiceV1('images');
minioService.ensureBucket().catch((err) => {
    console.error('Error ensuring bucket exists ( images ):', err);
});

class Handle_Upload_A_Image_To_Tks_Store {
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

    upload_Chunk = async (req: Request, res: Response) => {
        const my_response: My_Response_Field<unknown> = {
            is_success: false,
            message: 'Khởi tạo upload chunk !',
        };

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

            my_response.is_success = true;
            my_response.message = 'Upload chunk thành công';
            my_response.data = {
                chunk_index: index,
                etag: result.etag,
            };

            res.json(my_response);
            return;
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Upload chunk failed' });
            return;
        }
    };

    merge_Chunks = async (req: Request, res: Response) => {
        const { file_id, total_chunks, final_file_name } = req.body;

        const my_response: My_Response_Field<unknown> = {
            is_success: false,
            message: 'Khởi tạo Merge Chunks !',
        };

        if (!file_id || !total_chunks || !final_file_name) {
            res.status(400).json({ message: 'Missing params' });
            return;
        }

        const final_object_name = `${final_file_name}`;
        const merged_stream = new PassThrough();

        try {
            // 🚀 1. TÍNH SIZE SONG SONG
            const stats = await Promise.all(
                Array.from({ length: total_chunks }, (_, i) => minioService.stat(`chunks/${file_id}/${i}`))
            );

            const total_size = stats.reduce((sum, s) => sum + s.size, 0);

            // 🚀 2. upload ngay
            const upload_promise = minioService.uploadStream(final_object_name, merged_stream, total_size);

            // 🚀 3. merge chunk bằng pipeline (an toàn)
            for (let i = 0; i < total_chunks; i++) {
                const object_name = `chunks/${file_id}/${i}`;
                const chunk_stream = await minioService.getStream(object_name);

                await new Promise<void>((resolve, reject) => {
                    chunk_stream.once('error', reject).once('end', resolve).pipe(merged_stream, { end: false });
                });
            }

            // kết thúc stream
            merged_stream.end();

            // chờ upload hoàn tất
            await upload_promise;

            // 🚀 4. cleanup song song
            await Promise.all(
                Array.from({ length: total_chunks }, (_, i) => minioService.remove(`chunks/${file_id}/${i}`))
            );

            my_response.message = 'Đăng tải thước phim thành công !';
            my_response.is_success = true;
            my_response.data = final_object_name;
            res.json(my_response);
            return;
        } catch (error: any) {
            console.error(error);

            // ❗ cleanup nếu fail
            await Promise.allSettled(
                Array.from({ length: total_chunks }, (_, i) => minioService.remove(`chunks/${file_id}/${i}`))
            );

            console.error(error.response?.data || error);
            res.status(500).json(error.response?.data || error);
            return;
        }
    };
}

export default Handle_Upload_A_Image_To_Tks_Store;
