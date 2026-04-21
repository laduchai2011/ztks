import { BalanceFluctuationType, WalletType } from '.';

export interface CreateWalletBodyField {
    amount: number;
    type: WalletType;
    accountId: number;
}

export interface MoneyOutBodyField {
    walletId: number;
    subAmount: number;
}

export interface GetMyWalletWithTypeBodyField {
    type: WalletType;
    accountId: number;
}

export interface GetBalanceFluctuationsByDateBodyField {
    walletId: number;
    type: BalanceFluctuationType | null;
    fromDate: string;
    toDate: string;
}

export interface GetBalanceFluctuationLatestDayBodyField {
    walletId: number;
    type: BalanceFluctuationType | null;
}

export interface PayAgentFromWalletBodyField {
    walletId: number;
    agentPayId: number;
    accountId: number;
}

export interface PayOrderBodyField {
    walletId: number;
    addedAmount: number;
    orderId: number;
    payHookId: number;
}

export interface CreateRequireTakeMoneyBodyField {
    amount: number;
    bankId: number;
    walletId: number;
    accountId: number;
}

export interface EditRequireTakeMoneyBodyField {
    requireTakeMoneyId: number;
    amount: number;
    bankId: number;
    walletId: number;
    accountId: number;
}

export interface MemberTksConfirmTakeMoneyBodyField {
    requireTakeMoneyId: number;
    memberZtksId: number;
}

export interface PayOutBodyField {
    amount: number;
    bankId: number;
    payHookId: number;
    requireTakeMoneyId: number;
    walletId: number;
    accountId: number;
}

export interface MemberGetRequireTakeMoneyOfWalletBodyField {
    walletId: number;
    accountId: number;
}
