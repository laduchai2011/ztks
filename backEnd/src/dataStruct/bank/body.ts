export interface AddBankBodyField {
    bankCode: string;
    accountNumber: string;
    accountName: string;
    accountId: number;
}

export interface EditBankBodyField {
    id: number;
    bankCode: string;
    accountNumber: string;
    accountName: string;
    accountId: number;
}

export interface GetAllBanksBodyField {
    accountId: number;
}

export interface GetBankWithIdBodyField {
    id: number;
}
