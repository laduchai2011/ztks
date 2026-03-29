import express, { Router } from 'express';
import dotenv from 'dotenv';
import Handle_Upload from './handle/upload';
import Handle_UploadMultipleVideos from './handle/UploadMultipleVideos';
import Handle_UploadMulVideos from './handle/UploadMulVideos';
// import Handle_UploadAVideoTD from './handle/UploadAVideoTD';
import Handle_UploadChunk from './handle/UploadChunk';
import Handle_MergeChunks from './handle/MergeChunks';

dotenv.config();
const router_mutate_video: Router = express.Router();

const handle_Upload = new Handle_Upload();
const handle_uploadMultipleVideos = new Handle_UploadMultipleVideos();
const handle_uploadMulVideos = new Handle_UploadMulVideos();
// const handle_uploadAVideoTD = new Handle_UploadAVideoTD();
const handle_uploadChunk = new Handle_UploadChunk();
const handle_mergeChunks = new Handle_MergeChunks();

router_mutate_video.post(
    '/upload',
    handle_Upload.middle_upload,
    handle_Upload.middle_encode_video_to_HLS,
    handle_Upload.main
);

router_mutate_video.post(
    '/uploadMultipleVideos',
    handle_uploadMultipleVideos.upload().array('videos', 10),
    handle_uploadMultipleVideos.middle_upload,
    handle_uploadMultipleVideos.main
);

router_mutate_video.post(
    '/uploadMulVideos',
    handle_uploadMulVideos.upload().array('videos', 10),
    handle_uploadMulVideos.middle_upload,
    handle_uploadMulVideos.main
);

// router_mutate_video.post(
//     '/uploadAVideoTD',
//     handle_uploadAVideoTD.upload().single('video'),
//     handle_uploadAVideoTD.middle_upload,
//     handle_uploadAVideoTD.main
// );

router_mutate_video.post('/uploadChunk', handle_uploadChunk.upload().single('chunk'), handle_uploadChunk.main);

router_mutate_video.post('/mergeChunks', handle_mergeChunks.main);

export default router_mutate_video;
