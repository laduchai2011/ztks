export enum CallTypeEnum {
    AUDIO = 'audio',
    VIDEO = 'video',
    AUDIO_AND_VIDEO = 'audio_and_video',
}

export type CallTypeType = CallTypeEnum.AUDIO | CallTypeEnum.VIDEO | CallTypeEnum.AUDIO_AND_VIDEO;

export enum CallInCmdEnum {
    EMPTY = 'empty',
    ACCEPT = 'accept',
    CANCEl = 'cancel',
    FINISH = 'finish',
}

export type CallInCmdType = CallInCmdEnum.ACCEPT | CallInCmdEnum.CANCEl | CallInCmdEnum.FINISH | CallInCmdEnum.EMPTY;

export enum CallOutCmdEnum {
    EMPTY = 'empty',
    BEGIN = 'begin',
    CANCEl = 'cancel',
    FINISH = 'finish',
}

export type CallOutCmdType =
    | CallOutCmdEnum.BEGIN
    | CallOutCmdEnum.CANCEl
    | CallOutCmdEnum.FINISH
    | CallOutCmdEnum.EMPTY;

export enum CallInStateEnum {
    RINGING = 'ringing',
    CALL_IN = 'call_in',
    CALL_END = 'call_end',
}

export type CallInStateType = CallInStateEnum.RINGING | CallInStateEnum.CALL_IN | CallInStateEnum.CALL_END;

export enum CallOutStateEnum {
    RINGING = 'ringing',
    CONNECTING = 'connecting',
    CALL_IN = 'call_in',
    CALL_END = 'call_end',
}

export type CallOutStateType =
    | CallOutStateEnum.RINGING
    | CallOutStateEnum.CONNECTING
    | CallOutStateEnum.CALL_IN
    | CallOutStateEnum.CALL_END;

export interface CheckConsentField {
    data: { expired_time: number };
    error: number;
    message: string;
}

export interface RequestConsentField {
    error: number;
    message: string;
}
