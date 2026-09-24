export enum Select_Filter_Enum {
    Chat_Room_Id = 'chatRoomId',
    Order_Uuid = 'orderUuid',
    Phone_Number = 'phoneNumber',
}

export type Select_Filter_Type =
    | Select_Filter_Enum.Chat_Room_Id
    | Select_Filter_Enum.Order_Uuid
    | Select_Filter_Enum.Phone_Number;
