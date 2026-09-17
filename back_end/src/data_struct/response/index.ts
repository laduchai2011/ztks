export interface My_Response_Field<T> {
    message?: string;
    is_success?: boolean;
    err?: Error | string | unknown;
    data?: T;
    is_signin?: boolean;
    is_empty_data?: boolean;
    is_auth?: boolean;
}
