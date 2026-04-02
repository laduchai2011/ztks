export interface WalletField {
    id: number;
    amount: number;
    type: string;
    accountId: number;
    updateTime: string;
    createTime: string;
}

export interface BalanceFluctuationField {
    id: number;
    amount: number;
    type: BalanceFluctuationType;
    payHookId: number | null;
    walletId: number;
    createTime: string;
}

export interface PagedBalanceFluctuationField {
    items: BalanceFluctuationField[];
    totalCount: number;
}

export enum BalanceFluctuationEnum {
    PAY_ORDER = 'payOrder',
    PAY_AGENT = 'payAgent',
    TAKE_MONEY = 'takeMoney',
}

export type BalanceFluctuationType =
    | BalanceFluctuationEnum.PAY_ORDER
    | BalanceFluctuationEnum.PAY_AGENT
    | BalanceFluctuationEnum.TAKE_MONEY;
