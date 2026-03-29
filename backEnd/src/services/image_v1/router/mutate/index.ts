import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_UploadAImageToZalo from './handle/UploadAImageToZalo';

dotenv.config();

const router_mutate_image_v1: Router = express.Router();
const handle_uploadAImageToZalo = new Handle_UploadAImageToZalo();

router_mutate_image_v1.post(
    '/uploadAImageToZalo',
    authentication,
    handle_uploadAImageToZalo.upload().single('image'),
    handle_uploadAImageToZalo.main
);

export default router_mutate_image_v1;
