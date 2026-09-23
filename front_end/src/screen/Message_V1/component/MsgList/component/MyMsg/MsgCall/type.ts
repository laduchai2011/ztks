export enum Call_Finish_State_Enum {
    FAILURE = 'FAILURE',
    SUCCESS = 'SUCCESS',
}

export type Call_Finish_State_Type = Call_Finish_State_Enum.SUCCESS | Call_Finish_State_Enum.FAILURE;
