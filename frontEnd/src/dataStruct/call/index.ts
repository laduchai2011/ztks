export enum CallTypeEnum {
    AUDIO = 'audio',
    VIDEO = 'video',
    AUDIO_AND_VIDEO = 'audio_and_video',
}

export type CallTypeType = CallTypeEnum.AUDIO | CallTypeEnum.VIDEO | CallTypeEnum.AUDIO_AND_VIDEO;
