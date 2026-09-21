import { BASE_URL } from './base_url';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const IMAGE_V1_API = {
    UPLOAD_A_IMAGE_TO_ZALO: `${BASE_URL}${apiString}/service__image_v1/mutate/upload_a_image_to_zalo`,
    UPLOAD_CHUNK: `${BASE_URL}${apiString}/service__image_v1/mutate/upload_chunk`,
    MERGE_CHUNKS: `${BASE_URL}${apiString}/service__image_v1/mutate/merge_chunks`,
};
