export interface CreateVoucherBodyField {
    dayAmount: number;
    money: number;
    phone: string;
    memberZtksId: number;
}

export interface GetVouchersBodyField {
    page: number;
    size: number;
    isUsed: boolean | null;
    phone: string;
}

export interface GetVoucherWithOrderIdBodyField {
    orderId: number;
}
