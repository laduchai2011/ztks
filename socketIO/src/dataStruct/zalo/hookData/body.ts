export interface HookDataBodyField<T = ZaloMessageBodyType> {
    recipient: {
        user_id: string;
    };
    message: T;
}

interface MessageTextBodyField {
    text: string;
}

interface MessageImageBodyField {
    text: string;
    attachment: {
        type: 'template';
        payload: {
            template_type: 'media';
            elements: [
                {
                    media_type: 'image';
                    url: string;
                },
            ];
        };
    };
}

interface MessageFileBodyField {
    attachment: {
        type: 'file';
        payload: {
            token: string;
        };
    };
}

interface MessageStickerBodyField {
    attachment: {
        type: 'template';
        payload: {
            template_type: 'media';
            elements: [
                {
                    media_type: 'sticker';
                    attachment_id: string;
                },
            ];
        };
    };
}

type ZaloMessageBodyType =
    | MessageTextBodyField
    | MessageImageBodyField
    | MessageFileBodyField
    | MessageStickerBodyField
    | Record<string, unknown>; // fallback
