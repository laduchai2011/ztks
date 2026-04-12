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

// export interface GetAllWalletsBodyField {
//     accountId: number;
// }

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
