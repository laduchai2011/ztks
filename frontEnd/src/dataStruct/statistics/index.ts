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
