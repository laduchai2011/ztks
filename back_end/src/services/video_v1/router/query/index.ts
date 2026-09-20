import express, { Router } from 'express';
import { get_A_Video_From_Minio, download_Video_From_Minio } from './handle/Get_A_Video_From_Minio';

const router_query_video_v1: Router = express.Router();

router_query_video_v1.get('/video/:name', get_A_Video_From_Minio);

router_query_video_v1.get('/download_video/:name', download_Video_From_Minio);

export default router_query_video_v1;
