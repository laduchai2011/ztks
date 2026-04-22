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

export interface CustomerUseVoucherBodyField {
    orderId: number;
    voucherId: number;
    customerId: number;
}
