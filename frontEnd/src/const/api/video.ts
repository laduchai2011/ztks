import { BASE_URL } from './baseUrl';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const VIDEO_API = {
    UPLOAD_MULTIPLE_VIDEOS: `${BASE_URL}${apiString}/service_video/mutate/uploadMultipleVideos`,
    UPLOAD_MUL_VIDEOS: `${BASE_URL}${apiString}/service_video/mutate/uploadMulVideos`,
    UPLOAD_CHUNK: `${BASE_URL}${apiString}/service_video/mutate/uploadChunk`,
    MERGE_CHUNK: `${BASE_URL}${apiString}/service_video/mutate/mergeChunks`,
};
