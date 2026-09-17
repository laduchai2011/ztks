export interface Video_TD_Body_Field {
    receive_id: string;
    oaid: string;
    name: string;
    account_id: string;
}

export function is_video_td(data: unknown): data is Video_TD_Body_Field {
    return (
        typeof data === 'object' &&
        data !== null &&
        typeof (data as any).receiveId === 'string' &&
        typeof (data as any).oaid === 'string' &&
        typeof (data as any).name === 'string' &&
        typeof (data as any).accountId === 'string'
    );
}
