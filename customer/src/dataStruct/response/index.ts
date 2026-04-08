export interface MyResponse<T> {
    message?: string;
    isSuccess?: boolean;
    err?: Error | string | unknown;
    data?: T;
    isSignin?: boolean;
    isEmptyData?: boolean;
    isAuth?: boolean;
}
