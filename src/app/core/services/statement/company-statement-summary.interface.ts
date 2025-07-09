import { StatementLine } from './statement-line.interface';

export interface CompanyStatementSummary {
  lines: StatementLine[];
  totalCredit: number;
  totalDebit: number;
  balance: number;
  month: number;
  year: number;
}
