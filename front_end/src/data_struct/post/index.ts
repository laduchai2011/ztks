export interface Register_Post_Field {
    id: string;
    name: string;
    type: Register_Post_Type_Type;
    expiry_time: string | null;
    is_delete: boolean;
    zalo_oa_id: string;
    account_id: string;
    create_time: string;
}

export enum Register_Post_Type_Enum {
    FREE = 'free',
    UPGRADE = 'upgrade',
}
export type Register_Post_Type_Type = Register_Post_Type_Enum.FREE | Register_Post_Type_Enum.UPGRADE;

export interface Paged_Register_Post_Field {
    items: Register_Post_Field[];
    total_count: number;
}

export interface Post_Field {
    id: string;
    index: number;
    name: string;
    type: Post_Type_Type;
    title: string;
    describe: string;
    images: string;
    is_active: boolean;
    register_post_id: string;
    create_time: string;
}

export enum Post_Type_Enum {
    FREE = 'free',
    UPGRADE = 'upgrade',
}
export type Post_Type_Type = Post_Type_Enum.FREE | Post_Type_Enum.UPGRADE;

export interface Paged_Post_Field {
    items: Post_Field[];
    total_count: number;
}
