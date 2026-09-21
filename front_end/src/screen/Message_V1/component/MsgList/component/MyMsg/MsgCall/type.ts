export enum CallFinishStateEnum {
    FAILURE = 'FAILURE',
    SUCCESS = 'SUCCESS',
}

export type CallFinishStateType = CallFinishStateEnum.SUCCESS | CallFinishStateEnum.FAILURE;
