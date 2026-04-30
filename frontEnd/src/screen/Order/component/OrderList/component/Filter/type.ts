export enum SelectFilterEnum {
    ChatRoomId = 'chatRoomId',
    OrderUuid = 'orderUuid',
    PhoneNumber = 'phoneNumber',
}

export type SelectFilterType = SelectFilterEnum.ChatRoomId | SelectFilterEnum.OrderUuid | SelectFilterEnum.PhoneNumber;
