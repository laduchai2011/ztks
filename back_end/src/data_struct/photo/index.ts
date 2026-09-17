export interface A_Image_File_Field {
    file_name: string;
    mime_type: string;
    path: string;
    size: number;
}

export interface A_Video_File_Field {
    original_name: string;
    saved_name: string;
    path: string;
    size: number;
}

export interface Zalo_Oa_A_Image_Field {
    message: string;
    data: {
        attachment_id: string;
        url: string;
    };
}

export interface Zalo_Oa_Mul_Image_Field {
    message: string;
    results: Zalo_Oa_Aa_Image_Field[];
}

interface Zalo_Oa_Aa_Image_Field {
    file_name: string;
    attachment_id: string;
    url: string;
}
