export interface StatementLine {
    label: string;
    oppositeLabel: string;
    date: Date;
    amount: number;
    type: 'DEBIT' | 'CREDIT';
}
