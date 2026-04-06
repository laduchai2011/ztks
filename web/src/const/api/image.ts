import { BASE_URL } from './baseUrl';

const isProduct = process.env.NODE_ENV === 'production';
const apiString = isProduct ? '' : '/api';

export const IMAGE_API = {
    UPLOAD_A_IMAGE: `${BASE_URL}${apiString}/service_image/mutate/uploadAImage`,
    UPLOAD_MULTIPLE_IMAGE: `${BASE_URL}${apiString}/service_image/mutate/uploadMultipleImage`,
    UPLOAD_A_IMAGE_TO_ZALO: `${BASE_URL}${apiString}/service_image/mutate/uploadAImageToZalo`,
    UPLOAD_MULTIPLE_IMAGE_TO_ZALO: `${BASE_URL}${apiString}/service_image/mutate/uploadMultipleImageToZalo`,
    UPLOAD_CHUNK: `${BASE_URL}${apiString}/service_image/mutate/uploadChunk`,
    MERGE_CHUNK: `${BASE_URL}${apiString}/service_image/mutate/mergeChunks`,
};

// export const IMAGE_API_ZALO_WEBHOOK = {
//     UPLOAD_MULTIPLE_IMAGE_TO_ZALO: `${BASE_URL_ZALO_WEBHOOK}${apiString}/service_image/mutate/uploadMultipleImageToZalo`,
// };
