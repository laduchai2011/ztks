export interface AImageFileField {
    filename: string;
    mimetype: string;
    path: string;
    size: number;
}

export interface AVideoFileField {
    originalName: string;
    savedName: string;
    path: string;
    size: number;
}

// export interface ZaloOaAImageField {
//     message: string;
//     data: {
//         attachment_id: string;
//         url: string;
//     };
// }

// export interface ZaloOaMulImageField {
//     message: string;
//     results: ZaloOaAaImageField[];
// }

// interface ZaloOaAaImageField {
//     fileName: string;
//     attachment_id: string;
//     url: string;
// }
