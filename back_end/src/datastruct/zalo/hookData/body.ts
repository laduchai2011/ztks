export interface Hook_Data_Body_Field<T = Zalo_Message_Body_Type> {
    recipient: {
        user_id: string;
    };
    message: T;
}

interface Message_Text_Body_Field {
    text: string;
    quote_message_id?: string;
}

export interface Message_Image_Body_Field {
    text: string;
    attachment: {
        type: 'template';
        payload: {
            template_type: 'media';
            elements: [
                {
                    media_type: 'image';
                    url?: string;
                    attachment_id?: string;
                },
            ];
        };
    };
}

interface Message_File_Body_Field {
    attachment: {
        type: 'file';
        payload: {
            token: string;
        };
    };
}

interface Message_Sticker_Body_Field {
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

type Zalo_Message_Body_Type =
    | Message_Text_Body_Field
    | Message_Image_Body_Field
    | Message_File_Body_Field
    | Message_Sticker_Body_Field
    | Record<string, unknown>; // fallback
