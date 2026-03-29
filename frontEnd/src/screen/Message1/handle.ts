import { ZaloAppField, ZaloOaField } from '@src/dataStruct/zalo';
import { IMAGEV1_API } from '@src/const/api/imageV1';

export async function uploadAImageToZalo(file: File, zaloApp: ZaloAppField, zaloOa: ZaloOaField) {
    const form = new FormData();

    form.append('image', file);
    form.append('zaloApp', JSON.stringify(zaloApp));
    form.append('zaloOa', JSON.stringify(zaloOa));

    const res = await fetch(IMAGEV1_API.UPLOAD_A_IMAGE_TO_ZALO, {
        method: 'POST',
        body: form,
        credentials: 'include', // ⭐ gửi cookie
    });

    return res.json();
}
