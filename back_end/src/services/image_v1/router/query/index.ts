import express, { Router } from 'express';
import { get_A_Image_From_Minio } from './handle/Get_A_Image_From_Minio';

const router_query_image_v1: Router = express.Router();

router_query_image_v1.get('/image/:name', get_A_Image_From_Minio);

export default router_query_image_v1;
