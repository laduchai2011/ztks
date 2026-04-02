export interface WalletField {
    id: number;
    amount: number;
    type: WalletType;
    accountId: number;
    updateTime: string;
    createTime: string;
}

export enum WalletEnum {
    ONE = '1',
    TWO = '2',
}

export type WalletType = WalletEnum.ONE | WalletEnum.TWO;

export interface BalanceFluctuationField {
    id: number;
    amount: number;
    type: BalanceFluctuationType;
    payHookId: number | null;
    walletId: number;
    createTime: string;
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
