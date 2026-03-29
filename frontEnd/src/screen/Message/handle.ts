import axiosInstance from '@src/api/axiosInstance';
import { VIDEO_API } from '@src/const/api/video';
import { IMAGE_API } from '@src/const/api/image';
import { MyResponse } from '@src/dataStruct/response';
import { MessageField, SendVideoTdFailureBodyField, SendVideoTdSuccessBodyField } from '@src/dataStruct/message';

const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB

// export const uploadVideo = async (file: File, id: string) => {
//     const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
//     const uploadId = `${Date.now()}-${id}-${file.name}`;

//     const filename = `${Date.now()}_${id}_${file.name}`;

//     for (let index = 0; index < totalChunks; index++) {
//         const start = index * CHUNK_SIZE;
//         const end = Math.min(start + CHUNK_SIZE, file.size);
//         const chunk = file.slice(start, end);

//         const formData = new FormData();
//         formData.append('chunk', chunk);
//         formData.append('index', index.toString());
//         formData.append('uploadId', uploadId);
//         formData.append('filename', filename);
//         formData.append('totalChunks', totalChunks.toString());

//         await fetch(VIDEO_API.UPLOAD_CHUNK, {
//             method: 'POST',
//             body: formData,
//         });
//     }

//     await fetch(VIDEO_API.MERGE_CHUNK, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ uploadId, filename: filename }),
//     });

//     return { filename: filename };
// };

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

        const response1 = await axiosInstance.post<MyResponse<any>, any, any>(VIDEO_API.UPLOAD_CHUNK, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        const res1Data = response1.data;
        if (!res1Data?.isSuccess) {
            throw new Error(`Upload chunk ${chunkIndex} thất bại`);
        }
    }

    const response2 = await axiosInstance.post<MyResponse<any>, any, any>(
        VIDEO_API.MERGE_CHUNK,
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

    return objectName;
};

export const uploadImage = async (file: File, id: string) => {
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const uploadId = `${Date.now()}-${id}-${file.name}`;

    const filename = `${Date.now()}_${id}_${file.name}`;

    for (let index = 0; index < totalChunks; index++) {
        const start = index * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);

        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('index', index.toString());
        formData.append('uploadId', uploadId);
        formData.append('filename', filename);
        formData.append('totalChunks', totalChunks.toString());

        await fetch(IMAGE_API.UPLOAD_CHUNK, {
            method: 'POST',
            body: formData,
        });
    }

    await fetch(IMAGE_API.MERGE_CHUNK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uploadId, filename: filename }),
    });

    return { filename: filename };
};

export const handleSendVideoTdFailure = async (sendVideoTdFailureBody: SendVideoTdFailureBodyField) => {
    try {
        const response = await axiosInstance.post<MyResponse<MessageField>, any, SendVideoTdFailureBodyField>(
            `/service_message/mutate/sendVideoTdFailure`,
            sendVideoTdFailureBody
        );
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const handleSendVideoTdSuccess = async (sendVideoTdSuccessBody: SendVideoTdSuccessBodyField) => {
    try {
        const response = await axiosInstance.post<MyResponse<MessageField>, any, SendVideoTdSuccessBodyField>(
            `/service_message/mutate/sendVideoTdSuccess`,
            sendVideoTdSuccessBody
        );
        return response;
    } catch (error) {
        console.error(error);
    }
};
