export interface VoucherField {
    id: number;
    isUsed: boolean;
    timeExpire: string;
    money: number;
    orderId: number | null;
    memberZtksId: number;
    phone: string;
    updateTime: string;
    createTime: string;
}

export interface PagedVoucherField {
    items: VoucherField[];
    totalCount: number;
}
