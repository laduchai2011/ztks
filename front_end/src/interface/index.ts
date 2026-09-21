export interface router_res_type {
    message: string;
    status: '' | 'success' | 'failure' | 'warn-error' | 'error' | 'notify';
    error: unknown;
    data: unknown;
}
