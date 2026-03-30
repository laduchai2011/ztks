import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_UploadAImageToZalo from './handle/UploadAImageToZalo';
import Handle_UploadAImageToTksstore from './handle/UploadAImageToTksstore';

dotenv.config();

const router_mutate_image_v1: Router = express.Router();
const handle_uploadAImageToZalo = new Handle_UploadAImageToZalo();
const handle_uploadAImageToTksstore = new Handle_UploadAImageToTksstore();

router_mutate_image_v1.post(
    '/uploadAImageToZalo',
    authentication,
    handle_uploadAImageToZalo.upload().single('image'),
    handle_uploadAImageToZalo.main
);

router_mutate_image_v1.post(
    '/uploadChunk',
    handle_uploadAImageToTksstore.upload().single('chunk'),
    handle_uploadAImageToTksstore.uploadChunk
);

router_mutate_image_v1.post('/mergeChunks', handle_uploadAImageToTksstore.mergeChunks);

export default router_mutate_image_v1;
