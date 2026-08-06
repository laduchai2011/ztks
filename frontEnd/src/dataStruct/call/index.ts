export enum CallTypeEnum {
    AUDIO = 'audio',
    VIDEO = 'video',
    AUDIO_AND_VIDEO = 'audio_and_video',
}

export type CallTypeType = CallTypeEnum.AUDIO | CallTypeEnum.VIDEO | CallTypeEnum.AUDIO_AND_VIDEO;

export enum CallInStateEnum {
    RINGING = 'ringing',
    CONNECTING = 'connecting',
    CALL_IN = 'call_in',
    CALL_END = 'call_end',
}

export type CallInStateType =
    | CallInStateEnum.RINGING
    | CallInStateEnum.CONNECTING
    | CallInStateEnum.CALL_IN
    | CallInStateEnum.CALL_END;

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
