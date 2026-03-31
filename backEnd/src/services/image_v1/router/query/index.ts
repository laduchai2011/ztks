import express, { Router } from 'express';
import { getAImageFromMinio } from './handle/GetAImageFromMinio';

const router_query_image_v1: Router = express.Router();

router_query_image_v1.get('/image/:name', getAImageFromMinio);

export default router_query_image_v1;
