export interface TKSProps {
    name?: string;
    id?: string;
    data?: unknown;
    event?: {
        defaultEvent?: React.MouseEvent;
    };
    removeDefaultFunction: () => void;
    [key: string]: unknown;
}

export const TKS_Init: TKSProps = {
    removeDefaultFunction() {},
};

export interface ToastMessageProps {
    config?: ToastMessage_Config_Props;
    data?: ToastMessage_Data_Props;
    control?: ToastMessage_Control_Props;
    event?: ToastMessage_Event_Props;
}
interface ToastMessage_Config_Props {
    name?: string;
    id?: string;
    max_message?: number;
}
export interface ToastMessage_Data_Props {
    type?: messageType_type;
    message?: string;
}
interface ToastMessage_Control_Props {
    nothing?: string; // chưa có trường dữ liệu nào được sử dụng, trường này để tắt cảnh báo
}
interface ToastMessage_Event_Props {
    onData?: (TKS: TKSProps) => void;
}

export enum messageType_enum {
    NORMAL = 'NORMAL',
    SUCCESS = 'SUCCESS',
    WARN = 'WARN',
    ERROR = 'ERROR',
}

export type messageType_type =
    | typeof messageType_enum.NORMAL
    | typeof messageType_enum.SUCCESS
    | typeof messageType_enum.WARN
    | typeof messageType_enum.ERROR;
