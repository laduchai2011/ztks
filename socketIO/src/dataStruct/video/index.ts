export interface VideoTDBodyField {
    receiveId: string;
    oaid: string;
    name: string;
}

export function isVideoTDBodyField(data: unknown): data is VideoTDBodyField {
    return (
        typeof data === 'object' &&
        data !== null &&
        typeof (data as any).receiveId === 'string' &&
        typeof (data as any).oaid === 'string' &&
        typeof (data as any).name === 'string'
    );
}
