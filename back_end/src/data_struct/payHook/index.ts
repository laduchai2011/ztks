export interface Pay_Hook_Field {
    id: string;
    gateway: string;
    transaction_date: Date;
    account_number: string | null;
    sub_account: string | null;
    code: string | null;
    content: string | null;
    transfer_type: string | null;
    description: string | null;
    transfer_amount: number;
    reference_code: string | null;
    accumulated: number;
    agent_pay_id: string | null;
    order_id: string | null;
    require_take_money_id: string | null;
    wallet_id: string;
}
