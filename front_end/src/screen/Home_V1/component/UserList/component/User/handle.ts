export function handleNewMsgAmount(amount: number) {
    if (amount < 5) {
        return amount.toString();
    }
    return `5+`;
}
