export interface PayHookField {
    id: number;
    gateway: string;
    transactionDate: Date;
    accountNumber: string | null;
    subAccount: string | null;
    code: string | null;
    content: string | null;
    transferType: string | null;
    description: string | null;
    transferAmount: number;
    referenceCode: string | null;
    accumulated: number;
    agentPayId: number | null;
    orderId: number | null;
}
