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

export interface GetBalanceFluctuationsBodyField {
    page: number;
    size: number;
    walletId: number;
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

export interface DeleteRequireTakeMoneyBodyField {
    requireTakeMoneyId: number;
    accountId: number;
}

export interface MemberZtksConfirmTakeMoneyBodyField {
    requireTakeMoneyId: number;
    memberZtksId: number;
}

export interface TakeMoneyBodyField {
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

export interface GetRequireWithIdBodyField {
    id: number;
}

export interface MemberZtksGetRequiresTakeMoneyBodyField {
    page: number;
    size: number;
    memberZtksId?: number;
    isDo?: boolean;
    moneyFrom?: number;
    moneyTo?: number;
    doFromDate?: string;
    doToDate?: string;
    fromDate?: string;
    toDate?: string;
}
