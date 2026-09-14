import express, { Router } from 'express';
import authentication from '@src/auth';
import Handle_UploadAImageToZalo from './handle/UploadAImageToZalo';
import Handle_UploadAImageToTksStore from './handle/UploadAImageToTksStore';

const router_mutate_image_v1: Router = express.Router();

const handle_uploadAImageToZalo = new Handle_UploadAImageToZalo();
const handle_uploadAImageToTksStore = new Handle_UploadAImageToTksStore();

router_mutate_image_v1.post(
    '/uploadAImageToZalo',
    authentication,
    handle_uploadAImageToZalo.upload().single('image'),
    handle_uploadAImageToZalo.main
);

router_mutate_image_v1.post(
    '/uploadChunk',
    handle_uploadAImageToTksStore.upload().single('chunk'),
    handle_uploadAImageToTksStore.uploadChunk
);

router_mutate_image_v1.post('/mergeChunks', handle_uploadAImageToTksStore.mergeChunks);

export default router_mutate_image_v1;
