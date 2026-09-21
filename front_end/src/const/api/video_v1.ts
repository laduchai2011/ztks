import { BASE_URL } from './base_url';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const VIDEO_V1_API = {
    UPLOAD_CHUNK: `${BASE_URL}${apiString}/service__video_v1/mutate/upload_chunk`,
    MERGE_CHUNK: `${BASE_URL}${apiString}/service__video_v1/mutate/merge_chunks`,
};
