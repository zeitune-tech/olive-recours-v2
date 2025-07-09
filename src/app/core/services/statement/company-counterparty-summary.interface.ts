export interface CompanyCounterpartySummary {
  counterpartyCompany: string;
  counterpartyLogo: string | null;
  totalDebit: number;
  totalCredit: number;
  balance: number;
}
