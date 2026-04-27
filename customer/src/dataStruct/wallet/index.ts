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
    voucherId: number | null;
    orderId: number | null;
    requireTakeMoneyId: number | null;
    walletId: number;
    createTime: string;
}

export enum BalanceFluctuationEnum {
    PAY_ORDER = 'payOrder',
    PAY_AGENT = 'payAgent',
    TAKE_MONEY = 'takeMoney',
    COST_TAKE_MONEY5 = 'costTakeMoney5',
    RECOMMEND = 'recommend',
    VOUCHER = 'voucher',
    COST1 = 'cost1%',
}

export type BalanceFluctuationType =
    | BalanceFluctuationEnum.PAY_ORDER
    | BalanceFluctuationEnum.PAY_AGENT
    | BalanceFluctuationEnum.TAKE_MONEY
    | BalanceFluctuationEnum.COST_TAKE_MONEY5
    | BalanceFluctuationEnum.RECOMMEND
    | BalanceFluctuationEnum.VOUCHER
    | BalanceFluctuationEnum.COST1;

export interface RequireTakeMoneyField {
    id: number;
    isDo: boolean;
    doTime: string | null;
    amount: number;
    bankId: number;
    walletId: number;
    accountId: number;
    memberZtksId: number | null;
    isDelete: boolean;
    updateTime: string;
    createTime: string;
}

export interface PagedRequireTakeMoneyField {
    items: RequireTakeMoneyField[];
    totalCount: number;
}
