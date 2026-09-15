export enum Call_Type_Enum {
    AUDIO = 'audio',
    VIDEO = 'video',
    AUDIO_AND_VIDEO = 'audio_and_video',
}

export type Call_Type_Type = Call_Type_Enum.AUDIO | Call_Type_Enum.VIDEO | Call_Type_Enum.AUDIO_AND_VIDEO;

export enum Call_In_Cmd_Enum {
    EMPTY = 'empty',
    ACCEPT = 'accept',
    CANCEl = 'cancel',
    FINISH = 'finish',
}

export type Call_In_Cmd_Type =
    | Call_In_Cmd_Enum.ACCEPT
    | Call_In_Cmd_Enum.CANCEl
    | Call_In_Cmd_Enum.FINISH
    | Call_In_Cmd_Enum.EMPTY;

export enum Call_Out_Cmd_Enum {
    EMPTY = 'empty',
    BEGIN = 'begin',
    CANCEl = 'cancel',
    FINISH = 'finish',
}

export type Call_Out_Cmd_Type =
    | Call_Out_Cmd_Enum.BEGIN
    | Call_Out_Cmd_Enum.CANCEl
    | Call_Out_Cmd_Enum.FINISH
    | Call_Out_Cmd_Enum.EMPTY;

export enum Call_In_State_Enum {
    RINGING = 'ringing',
    CALL_IN = 'call_in',
    CALL_END = 'call_end',
}

export type Call_In_State_Type = Call_In_State_Enum.RINGING | Call_In_State_Enum.CALL_IN | Call_In_State_Enum.CALL_END;

export enum Call_Out_State_Enum {
    RINGING = 'ringing',
    CONNECTING = 'connecting',
    CALL_IN = 'call_in',
    CALL_END = 'call_end',
}

export type Call_Out_State_Type =
    | Call_Out_State_Enum.RINGING
    | Call_Out_State_Enum.CONNECTING
    | Call_Out_State_Enum.CALL_IN
    | Call_Out_State_Enum.CALL_END;

export interface Check_Consent_Field {
    data: { expired_time: number };
    error: number;
    message: string;
}

export interface Request_Consent_Field {
    error: number;
    message: string;
}
