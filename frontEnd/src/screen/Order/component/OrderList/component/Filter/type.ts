export enum SelectFilterEnum {
    ChatRoomId = 'chatRoomId',
    OrderId = 'orderId',
    PhoneNumber = 'phoneNumber',
}

export type SelectFilterType = SelectFilterEnum.ChatRoomId | SelectFilterEnum.OrderId | SelectFilterEnum.PhoneNumber;
