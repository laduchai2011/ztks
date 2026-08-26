export interface AddSalesBodyField {
    sales: number;
    zaloOaId: number;
    accountId: number;
    ofDay: Date;
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
