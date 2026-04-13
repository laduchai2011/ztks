import axiosInstance from '@src/api/axiosInstance';
import { ZaloAppField, ZaloOaField } from '@src/dataStruct/zalo';
import { IMAGEV1_API } from '@src/const/api/imageV1';
import { VIDEOV1_API } from '@src/const/api/videoV1';
import { MyResponse } from '@src/dataStruct/response';

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

const CHUNK_SIZE = 1 * 1024 * 1024; // 2MB

export const uploadVideo = async (file: File, id: string) => {
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

    // ✅ fileId backend đang dùng
    const timestamp = Date.now();
    const fileId = `${timestamp}-${id}`;
    const finalFileName = `${timestamp}-${id}-${file.name}`;

    // 🔹 Upload từng chunk
    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);

        const chunk = file.slice(start, end);

        const formData = new FormData();
        formData.append('chunk', chunk); // ⚡ field name phải đúng
        formData.append('fileId', fileId);
        formData.append('chunkIndex', chunkIndex.toString());

        const response1 = await axiosInstance.post<MyResponse<any>, any, any>(VIDEOV1_API.UPLOAD_CHUNK, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        const res1Data = response1.data;
        if (!res1Data?.isSuccess) {
            throw new Error(`Upload chunk ${chunkIndex} thất bại`);
        }
    }

    const response2 = await axiosInstance.post<MyResponse<any>, any, any>(
        VIDEOV1_API.MERGE_CHUNK,
        {
            fileId,
            totalChunks,
            finalFileName,
        },
        {
            headers: { 'Content-Type': 'application/json' },
        }
    );

    const res2Data = response2.data;

    if (!res2Data?.isSuccess) {
        throw new Error(`Merge chunk thất bại !`);
    }

    const objectName = res2Data.data;

    return { fileName: objectName };
};
