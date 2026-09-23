import axiosInstance from '@src/api/axiosInstance';
import { Zalo_App_Field, Zalo_Oa_Field } from '@src/data_struct/zalo';
import { IMAGE_V1_API } from '@src/const/api/image_v1';
import { VIDEO_V1_API } from '@src/const/api/video_v1';
import { My_Response_Field } from '@src/data_struct/response';
import { DeviceEnum } from '@src/device/type';

export async function uploadAImageToZalo(file: File, zalo_app: Zalo_App_Field, zalo_oa: Zalo_Oa_Field) {
    const form = new FormData();

    form.append('image', file);
    form.append('zalo_app', JSON.stringify(zalo_app));
    form.append('zalo_oa', JSON.stringify(zalo_oa));

    const res = await fetch(IMAGE_V1_API.UPLOAD_A_IMAGE_TO_ZALO, {
        method: 'POST',
        body: form,
        credentials: 'include', // ⭐ gửi cookie
        headers: {
            'x-device-type': DeviceEnum.WEB,
        },
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
        formData.append('file_id', fileId);
        formData.append('chunk_index', chunkIndex.toString());

        const response1 = await axiosInstance.post<My_Response_Field<any>, any, any>(
            VIDEO_V1_API.UPLOAD_CHUNK,
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
            }
        );

        const res1Data = response1.data;
        if (!res1Data?.is_success) {
            throw new Error(`Upload chunk ${chunkIndex} thất bại`);
        }
    }

    const response2 = await axiosInstance.post<My_Response_Field<any>, any, any>(
        VIDEO_V1_API.MERGE_CHUNK,
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

    if (!res2Data?.is_success) {
        throw new Error(`Merge chunk thất bại !`);
    }

    const objectName = res2Data.data;

    return { file_name: objectName };
};
