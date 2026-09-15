import { Request, Response, NextFunction } from 'express';
import { spawn } from 'child_process';
import ffmpegPath from 'ffmpeg-static';
import { handle_cmd } from './util';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { resolution_options } from './type';
// import { MyRequest } from '../../type';
import { MyResponse } from '@src/dataStruct/response';
import { AVideoFileField } from '@src/dataStruct/photo';

const root_path = process.cwd();
const videoPath = path.join(process.cwd(), 'data', 'video', 'input');

class Handle_UploadMultipleVideos {
    constructor() {}

    upload = (): multer.Multer => {
        if (!fs.existsSync(videoPath)) {
            fs.mkdirSync(videoPath, { recursive: true });
        }

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

    encode_video_to_HLS = async (video_name: string) => {
        const input_dir: string = path.join(root_path, 'data', 'video', 'input');
        const output_dir: string = path.join(root_path, 'data', 'video', 'output', video_name);

        if (!fs.existsSync(output_dir)) {
            fs.mkdirSync(output_dir, { recursive: true });
        }

        // handlfunctions -----------------------------------
        const cmd = (resolution: resolution_options) => {
            return handle_cmd({
                input_dir: input_dir,
                input_file: video_name,
                output_dir: output_dir,
                resolution: resolution,
            });
        };
        const ff = (resolution: resolution_options) => {
            return new Promise((resolve, reject) => {
                // if (ffmpegPath) {
                //     const result = spawnSync(ffmpegPath, cmd(resolution));

                //     if (result.error) {
                //         reject(result.error);
                //     } else {
                //         resolve(result.output);
                //     }
                // } else {
                //     reject('ffmpegPath is a null !');
                // }
                if (!ffmpegPath) return reject('ffmpegPath is null');

                const child = spawn(ffmpegPath, cmd(resolution));

                child.stdout.on('data', (data) => {
                    console.log(`[${video_name} ${resolution.w}x${resolution.h}] ${data}`);
                });

                child.stderr.on('data', (data) => {
                    console.error(`[${video_name} ${resolution.w}x${resolution.h}] ${data}`);
                });

                child.on('close', (code) => {
                    if (code === 0) resolve(code);
                    else reject(`ffmpeg exited with code ${code}`);
                });
            });
        };
        //-------------------------------------------------

        const ff_1920_1080 = ff({ w: '1920', h: '1080' });
        const ff_1280_720 = ff({ w: '1280', h: '720' });
        const ff_854_480 = ff({ w: '854', h: '480' });

        const ff_all = await Promise.all([ff_1920_1080, ff_1280_720, ff_854_480]);

        const sourcePath = path.join(__dirname, 'master.m3u8');
        const destinationPath = path.join(output_dir, 'master.m3u8');
        fs.copyFileSync(sourcePath, destinationPath);

        return ff_all;

        // try {
        //     const ff_all = await Promise.all([ff_1920_1080, ff_1280_720, ff_854_480]);

        //     const sourcePath = path.join(__dirname, 'master.m3u8');
        //     const destinationPath = path.join(output_dir, 'master.m3u8');
        //     fs.copyFileSync(sourcePath, destinationPath);
        //     // isSuccess = true;
        //     callback(ff_all, null);
        // } catch (error) {
        //     // myResponse.message = 'This is a error !';
        //     // myResponse.err = error;
        //     callback(null, error);
        // }
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

        res.locals.files = files;

        for (let i: number = 0; i < files.length; i++) {
            const filename = files[i].savedName;
            this.encode_video_to_HLS(filename);
        }

        next();
    };

    // middle_encode_videos_to_HLS = async (req: Request, res: Response, next: NextFunction) => {
    //     const files = res.locals.files;
    //     console.log(1111111, files);

    //     const myResponse: MyResponse<unknown> = {
    //         isSuccess: false,
    //     };

    //     for (let i: number = 0; i < files.length; i++) {
    //         const filename = files[i].savedName;
    //         await this.encode_video_to_HLS(filename);
    //     }

    //     next();
    // };

    main = (_: Request, res: Response) => {
        const files: AVideoFileField[] = res.locals.files;

        const myResponse: MyResponse<AVideoFileField[]> = {
            message: 'Đăng tải những thước phim thành công !',
            isSuccess: true,
            data: files,
        };

        res.json(myResponse);
    };
}

export default Handle_UploadMultipleVideos;
