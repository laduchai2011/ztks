import { BASE_URL } from './baseUrl';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const IMAGEV1_API = {
    UPLOAD_A_IMAGE_TO_ZALO: `${BASE_URL}${apiString}/service_image_v1/mutate/uploadAImageToZalo`,
    UPLOAD_CHUNK: `${BASE_URL}${apiString}/service_image_v1/mutate/uploadChunk`,
    MERGE_CHUNK: `${BASE_URL}${apiString}/service_image_v1/mutate/mergeChunks`,
};
