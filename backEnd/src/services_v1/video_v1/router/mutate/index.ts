import express, { Router } from 'express';
import Handle_UploadAVideoToTksStore from './handle/UploadAVideoToTksStore';

const router_mutate_video_v1: Router = express.Router();

const handle_uploadAVideoToTksStore = new Handle_UploadAVideoToTksStore();

router_mutate_video_v1.post(
    '/uploadChunk',
    handle_uploadAVideoToTksStore.upload().single('chunk'),
    handle_uploadAVideoToTksStore.uploadChunk
);

router_mutate_video_v1.post('/mergeChunks', handle_uploadAVideoToTksStore.mergeChunks);

export default router_mutate_video_v1;
