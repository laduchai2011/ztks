import axiosInstance from '@src/api/axiosInstance';
import { VIDEO_V1_API } from '@src/const/api/video_v1';
import { My_Response_Field } from '@src/data_struct/response';

const CHUNK_SIZE = 1 * 1024 * 1024; // 2MB

export const upload_Video = async (file: File, id: string) => {
    const total_chunks = Math.ceil(file.size / CHUNK_SIZE);

    // ✅ fileId backend đang dùng
    const timestamp = Date.now();
    const file_id = `${timestamp}-${id}`;
    const final_file_name = `${timestamp}-${id}-${file.name}`;

    // 🔹 Upload từng chunk
    for (let chunkIndex = 0; chunkIndex < total_chunks; chunkIndex++) {
        const start = chunkIndex * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);

        const chunk = file.slice(start, end);

        const formData = new FormData();
        formData.append('chunk', chunk); // ⚡ field name phải đúng
        formData.append('file_id', file_id);
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
            file_id,
            total_chunks,
            final_file_name,
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

export const generate_Video_Thumbnail = (videoUrl: string, ratio: number = 0.5): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');

        video.src = videoUrl;
        video.crossOrigin = 'anonymous';
        video.preload = 'auto';
        video.muted = true;

        video.onloadedmetadata = () => {
            if (!Number.isFinite(video.duration) || video.duration <= 0) {
                reject(new Error('Thời lượng video không hợp lệ'));
                return;
            }

            const safeRatio = Math.max(0, Math.min(1, ratio));

            video.currentTime = video.duration * safeRatio;
        };

        video.onseeked = () => {
            const canvas = document.createElement('canvas');

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const context = canvas.getContext('2d');

            if (!context) {
                reject(new Error('Không thể tạo Canvas'));
                return;
            }

            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(
                (blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error('Không thể tạo thumbnail'));
                },
                'image/jpeg',
                0.85
            );

            video.removeAttribute('src');
            video.load();
        };

        video.onerror = () => {
            reject(new Error('Không thể đọc video'));
        };
    });
};
