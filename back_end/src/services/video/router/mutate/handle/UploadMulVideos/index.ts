import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import sharp from 'sharp';
import { MyResponse } from '@src/dataStruct/response';
import { AVideoFileField } from '@src/dataStruct/photo';
import { exec } from 'child_process';
import { getAccessToken, refreshAccessToken } from '@src/services/zalo_webhook/handle/TokenZaloOA';
// import { my_log } from '@src/log';

const videoPath = path.join(process.cwd(), 'data', 'video', 'input');
// const imagePath = path.join(process.cwd(), 'data', 'image', 'input');
const imagePath = path.join(process.cwd(), 'data', 'image');
const folderInputPath = path.join(imagePath, 'input');
const folderOutputPath = path.join(imagePath, 'output');

const API_UPLOAD = 'https://openapi.zalo.me/v2.0/article/upload_video/preparevideo';
// const API_UPLOAD = 'https://openapi.zalo.me/v2.0/oa/upload/video';
const API_SEND = 'https://openapi.zalo.me/v3.0/oa/message/cs';

class Handle_UploadMulVideos {
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

        if (!req.files) {
            myResponse.message = 'Không có file nào được tải lên';
            res.status(400).json(myResponse);
            return;
        }

        const files = (req.files as Express.Multer.File[]).map((file) => ({
            originalName: file.originalname,
            savedName: file.filename,
            size: file.size,
            path: file.path,
        }));

        for (let i: number = 0; i < files.length; i++) {
            const inputVideoPath = path.join(videoPath, files[i].savedName);
            // const output = path.join(imagePath, `${files[i].savedName}.jpg`);
            const inputImagePath = path.join(folderInputPath, `${files[i].savedName}.jpg`);
            const outputImagePath = path.join(folderOutputPath, `${files[i].savedName}.jpg`);
            this.captureFrame(inputVideoPath, inputImagePath, 1)
                .then(() => {
                    // const stats = fs.statSync(inputImagePath);
                    // const fileSizeInBytes = stats.size;
                    // if (fileSizeInBytes > 1024 * 1024) {
                    //     compressImageFromUrl(inputImagePath, outputImagePath);
                    // }
                    compressImageFromUrl(inputImagePath, outputImagePath);
                    // const uploadRes = uploadToZalo(files[i].path, inputImagePath);
                })
                .catch((err) => console.error(err));
        }

        res.locals.files = files;

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

    main = async (req: Request, res: Response) => {
        try {
            const files: AVideoFileField[] = res.locals.files;
            // const { userId, text } = req.body;

            if (!files || files.length === 0) {
                res.status(400).json({ error: 'Thiếu files' });
                return;
            }

            // for (const file of files) {
            //     const imageThumbPath = 'D:/zalo5k/backEnd/data/image/output/manhba-1764837306337.jpg';
            //     const uploadRes = await uploadToZalo(file.path, imageThumbPath);
            //     console.log(111111, uploadRes);
            //     await sendImage('5324785107455488962', uploadRes.data.token);
            // }

            const myResponse: MyResponse<AVideoFileField[]> = {
                message: 'Đăng tải những thước phim thành công !',
                isSuccess: true,
                data: files,
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

async function uploadToZalo(filePath: string, imageThumbPath: string) {
    // const form = new FormData();
    // form.append('file', fs.createReadStream(filePath));
    // form.append('image', fs.createReadStream(imageThumbPath));
    function buildForm() {
        const form = new FormData();
        form.append('file', fs.createReadStream(filePath));
        form.append('thumb', fs.createReadStream(imageThumbPath));
        return form;
    }

    const form1 = buildForm();

    const token = await getAccessToken();

    const res: any = await axios.post(API_UPLOAD, form1, {
        headers: {
            ...form1.getHeaders(),
            // 'Content-Type': 'form-data/multipart',
            // 'Reponse-Type': 'text/json',
            access_token: token,
        },
    });

    if (res?.error !== 0) {
        const form2 = buildForm();
        const newToken = await refreshAccessToken({ repeat: 5 });
        const res1: any = await axios.post(API_UPLOAD, form2, {
            headers: {
                ...form2.getHeaders(),
                // 'Content-Type': 'form-data/multipart',
                // 'Reponse-Type': 'text/json',
                access_token: newToken,
            },
        });
        return res1.data;
    }

    return res.data;
}

// -------------- Gửi tin nhắn hình ảnh --------------
async function sendImage(userId: string, token: string, text?: string) {
    // const body = {
    //     recipient: { user_id: userId },
    //     message: {
    //         attachment: {
    //             type: 'file',
    //             payload: { token: token },
    //         },
    //     },
    // };
    // const body = {
    //     recipient: { user_id: userId },
    //     message: {
    //         text: 'This is testing message',
    //         attachments: [
    //             {
    //                 payload: {
    //                     thumbnail:
    //                         'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlnhFBNw9Io0hHvtv8QzH_euzwGbRJv_IC9A&s',
    //                     description: 'description_of_link',
    //                     url: 'https://api.5kaquarium.com/service_video/query/streamVideo?id=manhba-1764809337875.mp4',
    //                 },
    //                 type: 'video',
    //             },
    //         ],
    //     },
    // };

    // const body = {
    //     recipient: { user_id: userId },
    //     message: {
    //         text: '',
    //         attachment: {
    //             type: 'template',
    //             payload: {
    //                 elements: [
    //                     {
    //                         url: 'https://api.5kaquarium.com/service_video/query/streamVideo?id=manhba-1764809337875.mp4',
    //                         media_type: 'video',
    //                     },
    //                 ],
    //             },
    //         },
    //     },
    // };

    const body = {
        recipient: { user_id: userId },
        message: {
            text: 'Video của bạn đây!',
            attachments: [
                {
                    type: 'template',
                    payload: {
                        thumbnail:
                            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlnhFBNw9Io0hHvtv8QzH_euzwGbRJv_IC9A&s',
                        description: 'Video',
                        href: 'https://api.5kaquarium.com/service_video/query/streamVideo?id=manhba-1764809337875.mp4',
                    },
                },
            ],
        },
    };

    const accessToken = await getAccessToken();

    const res = await axios.post(API_SEND, body, {
        headers: {
            access_token: accessToken,
            'Content-Type': 'application/json',
        },
    });

    console.log(2222, res.data);
    return res.data;
}

export default Handle_UploadMulVideos;
