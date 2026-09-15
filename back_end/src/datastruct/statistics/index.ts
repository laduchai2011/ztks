export enum StatisticsFlag {
    New = 'new',
    Old = 'old',
}

export type StatisticsFlagType = StatisticsFlag.New | StatisticsFlag.Old;

export interface StatisticsOaField {
    id: number;
    sales: number;
    orderAmount: number;
    isDelete: boolean;
    zaloOaId: number;
    ofDay: Date;
    createTime: Date;
}

export interface StatisticsMemberInOneMonthField {
    id: number;
    sales: number;
    orderAmount: number;
    flag: StatisticsFlagType;
    isDelete: boolean;
    ofMonth: Date;
    zaloOaId: number;
    accountId: number;
    createTime: Date;
}
