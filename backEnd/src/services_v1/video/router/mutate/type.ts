import { Request } from 'express';

export interface MyRequest extends Request {
    video_name: string;
}
