export interface OrderField {
    id: number;
    uuid: string;
    label: string;
    content: string;
    money: number;
    isPay: boolean;
    phone: string;
    isDelete: boolean;
    chatRoomId: number;
    updateTime: Date;
    createTime: Date;
}

export interface PagedOrderField {
    items: OrderField[];
    totalCount: number;
}

export interface OrderStatusField {
    id: number;
    type: string;
    content: string;
    orderId: number;
    updateTime: string;
    createTime: string;
}
