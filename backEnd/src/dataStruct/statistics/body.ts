export interface AddSalesBodyField {
    isNew: boolean;
    sales: number;
    zaloOaId: number;
    accountId: number;
    ofDay: Date;
}

export interface GetStatisticsBodyField {
    fromDate: string;
    toDate: string;
    zaloOaId: number;
    accountId: number;
}

export interface GetStatisticsOfDayBodyField {
    ofDay: Date;
    zaloOaId: number;
    accountId: number;
}

export interface CreateStatisticsBodyField {
    sales: number;
    zaloOaId: number;
    accountId: number;
    ofDay: Date;
}

export interface UpdateStatisticsBodyField {
    sales: number;
    zaloOaId: number;
    accountId: number;
    ofDay: Date;
}

export interface UpdateStatisticsWithNewOrderBodyField {
    sales: number;
    zaloOaId: number;
    accountId: number;
    ofDay: Date;
}

export interface UpdateStatisticsWithOldOrderBodyField {
    sales: number;
    zaloOaId: number;
    accountId: number;
    ofDay: Date;
}
