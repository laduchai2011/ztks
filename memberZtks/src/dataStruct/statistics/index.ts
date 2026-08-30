export interface StatisticsField {
    id: number;
    sales: number;
    averageSales: number;
    orderAmount: number;
    averageOrderAmount: number;
    mostMoneyOfOrder: number;
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
