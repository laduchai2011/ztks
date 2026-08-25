export interface AddSalesBodyField {
    sales: number;
    zaloOaId: number;
    accountId: number;
    ofDay: Date;
}

export interface CreateStatisticsBodyField {
    sales: number;
    zaloOaId: number;
    accountId: number;
    ofDay: string;
}

export interface UpdateStatisticsBodyField {
    sales: number;
    zaloOaId: number;
    accountId: number;
    ofDay: string;
}
