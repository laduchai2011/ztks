export interface GetStatisticsOaBodyField {
    fromDate: string;
    toDate: string;
    zaloOaId: number;
}

export interface UpdateStatisticsBodyField {
    sales: number;
    zaloOaId: number;
    accountId: number;
    ofDay: Date;
}

export interface GetStatisticsMemberInOneMonthBodyField {
    ofMonth: Date;
    zaloOaId: number;
    accountId: number;
}
