export interface StatisticsField {
    id: number;
    sales: number;
    orderAmount: number;
    isDelete: boolean;
    zaloOaId: number;
    accountId: number;
    ofDay: Date;
    createTime: Date;
}

export interface PagedStatisticsField {
    items: StatisticsField[];
    totalCount: number;
}

export interface StatisticsTotalField {
    sales: number;
    averageSales: number;
    orderAmount: number;
    averageOrderAmount: number;
    ofDay: string;
}

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
