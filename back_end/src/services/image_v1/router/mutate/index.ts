import express, { Router } from 'express';
import authentication from '@src/auth';
import Handle_Upload_A_Image_To_Zalo from './handle/Upload_A_Image_To_Zalo';
import Handle_Upload_A_Image_To_Tks_Store from './handle/Upload_A_Image_To_Tks_Store';

const router_mutate_image_v1: Router = express.Router();

const handle_upload_a_image_to_zalo = new Handle_Upload_A_Image_To_Zalo();
const handle_upload_a_image_to_tks_store = new Handle_Upload_A_Image_To_Tks_Store();

router_mutate_image_v1.post(
    '/upload_a_image_to_zalo',
    authentication,
    handle_upload_a_image_to_zalo.upload().single('image'),
    handle_upload_a_image_to_zalo.main
);

router_mutate_image_v1.post(
    '/upload_chunk',
    handle_upload_a_image_to_tks_store.upload().single('chunk'),
    handle_upload_a_image_to_tks_store.upload_Chunk
);

router_mutate_image_v1.post('/merge_chunks', handle_upload_a_image_to_tks_store.merge_Chunks);

export default router_mutate_image_v1;
