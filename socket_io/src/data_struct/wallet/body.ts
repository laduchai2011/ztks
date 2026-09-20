import { Wallet_Type } from '.';

export interface Create_Wallet_Body_Field {
    amount: number;
    type: Wallet_Type;
    account_id: string;
}

export interface Money_Out_Body_Field {
    wallet_id: string;
    sub_amount: number;
}

export interface Get_My_Wallet_With_Type_Body_Field {
    type: Wallet_Type;
    account_id: string;
}

// // Chuan bi bo
// export interface GetBalanceFluctuationsByDateBodyField {
//     walletId: number;
//     type: BalanceFluctuationType | null;
//     fromDate: string;
//     toDate: string;
// }

// // Chuan bi bo
// export interface GetBalanceFluctuationLatestDayBodyField {
//     walletId: number;
//     type: BalanceFluctuationType | null;
// }

export interface Get_Balance_Fluctuations_Body_Field {
    page: number;
    size: number;
    wallet_id: string;
}

export interface Pay_Agent_From_Wallet_Body_Field {
    wallet_id: string;
    agent_pay_id: string;
    account_id: string;
}

export interface Pay_Order_Body_Field {
    wallet_id: string;
    added_amount: number;
    order_id: string;
    pay_hook_id: string;
}

export interface Create_Require_Take_Money_Body_Field {
    amount: number;
    bank_id: string;
    wallet_id: string;
    account_id: string;
}

export interface Edit_Require_Take_Money_Body_Field {
    require_take_money_id: string;
    amount: number;
    bank_id: string;
    wallet_id: string;
    account_id: string;
}

export interface Delete_Require_Take_Money_Body_Field {
    require_take_money_id: string;
    account_id: string;
}

export interface Member_Ztks_Confirm_Take_Money_Body_Field {
    require_take_money_id: string;
    member_ztks_id: string;
}

export interface Take_Money_Body_Field {
    amount: number;
    bank_id: string;
    pay_hook_id: string;
    require_take_money_id: string;
    wallet_id: string;
    account_id: string;
}

export interface Member_Get_Require_Take_Money_Of_Wallet_Body_Field {
    wallet_id: string;
    account_id: string;
}

export interface Get_Require_With_Id_Body_Field {
    id: string;
}

export interface Member_Ztks_Get_Requires_Take_Money_Body_Field {
    page: number;
    size: number;
    member_ztks_id?: string;
    is_do?: boolean;
    money_from?: number;
    money_to?: number;
    do_from_date?: string;
    do_to_date?: string;
    from_date?: string;
    to_date?: string;
}
