import { CompanyCounterpartySummary } from './company-counterparty-summary.interface';

export interface GlobalStatementSummary {
  companyName: string;
  companyLogo: string;
  month: number;
  year: number;
  federationName: string;
  federationLogo: string;
  totalDebit: number;
  totalCredit: number;
  globalBalance: number;
  feePercentage: number;
  totalFees: number;
  counterparties: CompanyCounterpartySummary[];

}
