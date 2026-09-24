import { IMAGE_V1_API } from '@src/const/api/image_v1';

const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB

export const uploadImage = async (file: File, id: string): Promise<{ file_name: string }> => {
    const total_chunks = Math.ceil(file.size / CHUNK_SIZE);
    const uploadId = `${Date.now()}-${id}-${file.name}`;

    const file_name = `${Date.now()}_${id}_${file.name}`;

    for (let index = 0; index < total_chunks; index++) {
        const start = index * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);

        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('chunk_index', index.toString());
        formData.append('file_id', uploadId);

        await fetch(IMAGE_V1_API.UPLOAD_CHUNK, {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });
    }

    const mergeBody = {
        file_id: uploadId,
        total_chunks,
        final_file_name: file_name,
    };
    await fetch(IMAGE_V1_API.MERGE_CHUNKS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mergeBody),
        credentials: 'include', // 👈 thêm dòng này
    });

    return { file_name: file_name };
};
