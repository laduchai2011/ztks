import { BASE_URL } from './baseUrl';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const VIDEOV1_API = {
    UPLOAD_CHUNK: `${BASE_URL}${apiString}/service_video_v1/mutate/uploadChunk`,
    MERGE_CHUNK: `${BASE_URL}${apiString}/service_video_v1/mutate/mergeChunks`,
};
