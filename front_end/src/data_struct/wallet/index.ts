export interface Wallet_Field {
    id: string;
    amount: number;
    type: Wallet_Type;
    account_id: string;
    update_time: string;
    create_time: string;
}

export enum Wallet_Enum {
    ONE = '1',
    TWO = '2',
}

export type Wallet_Type = Wallet_Enum.ONE | Wallet_Enum.TWO;

export interface Balance_Fluctuation_Field {
    id: string;
    amount: number;
    type: Balance_Fluctuation_Type;
    pay_hook_id: string | null;
    voucher_id: string | null;
    order_id: string | null;
    require_take_money_id: string | null;
    wallet_id: string;
    create_time: string;
}

export enum Balance_Fluctuation_Enum {
    PAY_ORDER = 'payOrder',
    PAY_AGENT = 'payAgent',
    TAKE_MONEY = 'takeMoney',
    COST_TAKE_MONEY5 = 'costTakeMoney5',
    RECOMMEND = 'recommend',
    VOUCHER = 'voucher',
    COST1 = 'cost1%',
}

export type Balance_Fluctuation_Type =
    | Balance_Fluctuation_Enum.PAY_ORDER
    | Balance_Fluctuation_Enum.PAY_AGENT
    | Balance_Fluctuation_Enum.TAKE_MONEY
    | Balance_Fluctuation_Enum.COST_TAKE_MONEY5
    | Balance_Fluctuation_Enum.RECOMMEND
    | Balance_Fluctuation_Enum.VOUCHER
    | Balance_Fluctuation_Enum.COST1;

export interface Require_Take_Money_Field {
    id: string;
    is_do: boolean;
    do_time: string | null;
    amount: number;
    bank_id: string;
    wallet_id: string;
    account_id: string;
    member_ztks_id: string | null;
    is_delete: boolean;
    update_time: string;
    create_time: string;
}

export interface Paged_Require_Take_Money_Field {
    items: Require_Take_Money_Field[];
    total_count: number;
}
