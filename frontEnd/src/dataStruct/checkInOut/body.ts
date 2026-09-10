import { CheckInOutType } from './index';

export interface CreateCheckInOutBodyField {
    type: CheckInOutType;
    note: string;
    image: string | null;
    video: string | null;
    accountId: number;
}

export interface GetMyCheckInOutsBodyField {
    fromDate: string;
    toDate: string;
    accountId: number;
}

export interface GetCheckInOutsWithDateBodyField {
    type: CheckInOutType;
    date: string;
    accountId: number;
}

export interface CreateCheckInOutInspectBodyField {
    content: string;
    isPass: boolean;
    checkInOutId: number;
    accountId: number;
}

export interface GetCheckInOutInspectWithFkBodyField {
    checkInOutId: number;
}
