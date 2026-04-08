export interface ZaloUserField {
    data: {
        avatar: string;
        avatars: {
            120: string;
            240: string;
        };
        display_name: string;
        dynamic_param: string;
        is_sensitive: boolean;
        shared_info: {
            address: string;
            city: string;
            district: string;
            name: string;
            phone: number;
            user_dob: string;
        };
        tags_and_notes_info: {
            notes: string[];
            tag_names: string[];
        };
        user_alias: string;
        user_external_id: string;
        user_id: string;
        user_id_by_app: string;
        user_is_follower: boolean;
        user_last_interaction_date: string;
        user_gender: string;
        tags: [];
    };
    error: number;
    message: string;
}
