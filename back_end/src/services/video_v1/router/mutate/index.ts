import express, { Router } from 'express';
import Handle_Upload_A_Video_To_Tks_Store from './handle/Upload_A_Video_To_Tks_Store';

const router_mutate_video_v1: Router = express.Router();

const handle_upload_a_video_to_tks_store = new Handle_Upload_A_Video_To_Tks_Store();

router_mutate_video_v1.post(
    '/upload_chunk',
    handle_upload_a_video_to_tks_store.upload().single('chunk'),
    handle_upload_a_video_to_tks_store.upload_Chunk
);

router_mutate_video_v1.post('/merge_chunks', handle_upload_a_video_to_tks_store.merge_Chunks);

export default router_mutate_video_v1;
