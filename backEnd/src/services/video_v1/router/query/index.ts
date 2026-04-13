import express, { Router } from 'express';
import { getAVideoFromMinio, downloadVideoFromMinio } from './handle/GetAVideoFromMinio';

const router_query_video_v1: Router = express.Router();

router_query_video_v1.get('/video/:name', getAVideoFromMinio);

router_query_video_v1.get('/downloadVideo/:name', downloadVideoFromMinio);

export default router_query_video_v1;
