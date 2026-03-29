import express, { Router } from 'express';
import dotenv from 'dotenv';
import Handle_Watch from './handle/watch';

dotenv.config();
const router_store_video: Router = express.Router();

const handle_watch = new Handle_Watch();

// router_store_video.get('/watch', handle_watch.main);

// router_store_video.get('/*.m3u8', handle_watch.main_playlist);

// router_store_video.get('/*.ts', handle_watch.main_segment);

router_store_video.get('/:folder/:file', handle_watch.main);

// router_store_video.get('/:folder/:file.m3u8', handle_watch.main_playlist);

// router_store_video.get('/:folder/:file.ts', handle_watch.main_segment);

export default router_store_video;
