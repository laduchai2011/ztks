export enum CheckInOutEnum {
    IN = 'in',
    OUT = 'out',
}

export type CheckInOutType = CheckInOutEnum.IN | CheckInOutEnum.OUT;

export interface CheckInOutField {
    id: number;
    type: CheckInOutType;
    note: string;
    image: string | null;
    video: string | null;
    isDelete: boolean;
    accountId: number;
    createTime: string;
}
