import express, { Router } from 'express';
import dotenv from 'dotenv';
import Handle_Watch from './handle/watch';
import { streamVideo } from './handle/StreamVideo';

dotenv.config();
const router_get_video: Router = express.Router();

const handle_Watch = new Handle_Watch();

router_get_video.get('/watch', handle_Watch.main);

router_get_video.get('/*.m3u8', handle_Watch.main_playlist);

router_get_video.get('/*.ts', handle_Watch.main_segment);

router_get_video.get('/streamVideo', streamVideo);

export default router_get_video;
