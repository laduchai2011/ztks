export interface MessageField {
    id: number;
    eventName: string;
    sender: sender_type;
    receiveId: string;
    message: string;
    type: messageType_type;
    timestamp: string;
    messageStatus: messageStatus_type;
    status: string;
    accountId: number;
    updateTime: string;
    createTime: string;
}

export interface MessageBodyField {
    page: number;
    size: number;
    receiveId: string;
    accountId?: number;
}

export interface PagedMessageField {
    items: MessageField[];
    totalCount: number;
}

export interface CreateMessageBodyField {
    eventName: string;
    sender: sender_type;
    receiveId: string;
    message: string;
    type: messageType_type;
    timestamp: string;
    messageStatus: string;
    accountId: number;
}

export enum messageStatus_enum {
    SENDING = 'SENDING',
    SENT = 'SENT',
    RECEIVE = 'RECEIVE',
    SEEN = 'SEEN',
}

type messageStatus_type =
    | messageStatus_enum.SENDING
    | messageStatus_enum.SENT
    | messageStatus_enum.RECEIVE
    | messageStatus_enum.SEEN;

export enum sender_enum {
    MEMBER = 'MEMBER',
    CUSTOMER = 'CUSTOMER',
}

type sender_type = sender_enum.MEMBER | sender_enum.CUSTOMER;

export enum messageType_enum {
    TEXT = 'TEXT',
    IMAGES = 'IMAGES',
    VIDEOS = 'VIDEOS',
}

export type messageType_type = messageType_enum.TEXT | messageType_enum.IMAGES | messageType_enum.VIDEOS;

export interface UpdateEventMemberSendBodyField {
    eventName: string;
    receiveId: string;
    timestamp: string;
    messageStatus: messageStatus_type;
    accountId: number;
}
