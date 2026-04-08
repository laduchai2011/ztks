export interface OrdersFilterBodyField {
    page: number;
    size: number;
    uuid?: string;
    moneyFrom?: number;
    moneyTo?: number;
    isPay?: boolean;
    phone?: string;
    chatRoomId?: number;
    zaloOaId?: number;
    accountId: number;
}

export interface CreateOrderBodyField {
    uuid: string;
    label: string;
    content: string;
    money: number;
    phone: string;
    chatRoomId: number;
    zaloOaId: number;
    accountId: number;
}

export interface UpdateOrderBodyField {
    id: number;
    label: string;
    content: string;
    money: number;
    phone: string;
    accountId: number;
}

export interface GetMyOrderWithIdBodyField {
    id: number;
    accountId: number;
}

export interface GetOrderWithIdBodyField {
    id: number;
}

export interface CreateOrderStatusBodyField {
    type: string;
    content: string;
    orderId: number;
    accountId: number;
}

export interface GetAllOrderStatusBodyField {
    orderId: number;
}

export interface UpdateOrderPaidBodyField {
    id: number;
    money: number;
}

export interface OrderSelectVoucherBodyField {
    id: number;
    voucherId: number;
    accountId: number;
}
