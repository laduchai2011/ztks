import { Request, Response, NextFunction } from 'express';
import { spawnSync } from 'child_process';
import ffmpegPath from 'ffmpeg-static';
import { handle_cmd } from './util';
import path from 'path';
import fs from 'fs';
import { resolution_options } from './type';
import { MyRequest } from '../../type';
import { MyResponse } from '@src/dataStruct/response';

const root_path = process.cwd();

class Handle_Upload {
    constructor() {}

    middle_upload = async (req: Request, res: Response, next: NextFunction) => {
        const myReq = req as MyRequest;
        myReq.video_name = 'video.mp4';

        const myResponse: MyResponse<unknown> = {
            isSuccess: false,
        };

        if (myReq.video_name) {
            next();
        } else {
            res.json(myResponse);
            return;
        }
    };

    middle_encode_video_to_HLS = async (req: Request, res: Response, next: NextFunction) => {
        const myReq = req as MyRequest;

        const myResponse: MyResponse<unknown> = {
            isSuccess: false,
        };

        let isSuccess: boolean = false;

        const video_name: string = myReq.video_name;
        // const video_name: string = 'video.mp4';

        if (video_name) {
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
                    if (ffmpegPath) {
                        const result = spawnSync(ffmpegPath, cmd(resolution));

                        if (result.error) {
                            reject(result.error);
                        } else {
                            resolve(result.output);
                        }
                    } else {
                        reject('ffmpegPath is a null !');
                    }
                });
            };
            //-------------------------------------------------

            const ff_1920_1080 = ff({ w: '1920', h: '1080' });
            const ff_1280_720 = ff({ w: '1280', h: '720' });
            const ff_854_480 = ff({ w: '854', h: '480' });

            try {
                const ff_all = await Promise.all([ff_1920_1080, ff_1280_720, ff_854_480]);

                console.log(ff_all);

                const sourcePath = path.join(__dirname, 'master.m3u8');
                const destinationPath = path.join(output_dir, 'master.m3u8');
                fs.copyFileSync(sourcePath, destinationPath);
                isSuccess = true;
            } catch (error) {
                myResponse.message = 'This is a error !';
                myResponse.err = error;
            }
        } else {
            myResponse.message = 'Name of video must is a string !';
        }

        if (isSuccess) {
            next();
        } else {
            res.json(myResponse);
            return;
        }
    };

    main = (req: Request, res: Response) => {
        const myReq = req as MyRequest;
        const video_name: string = myReq.video_name;

        const myResponse: MyResponse<unknown> = {
            message: `Video (${video_name}) is uploaded successly !`,
            isSuccess: true,
        };

        res.json(myResponse);
    };
}

export default Handle_Upload;
