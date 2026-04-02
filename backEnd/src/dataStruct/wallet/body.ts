import { BalanceFluctuationType } from '.';

export interface CreateWalletBodyField {
    amount: number;
    type: string;
    accountId: number;
}

export interface MoneyInBodyField {
    walletId: number;
    addedAmount: number;
}

export interface MoneyOutBodyField {
    walletId: number;
    subAmount: number;
}

export interface GetAllWalletsBodyField {
    type: number;
    accountId: number;
}

export interface GetbalanceFluctuationsBodyField {
    page: number;
    size: number;
    type: BalanceFluctuationType | null;
    walletId: number;
}
