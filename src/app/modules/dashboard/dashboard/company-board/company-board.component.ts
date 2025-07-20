import { Component, OnInit, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

interface StatementLine {
  label: string;
  oppositeLabel: string;
  date: Date;
  amount: number;
  type: 'DEBIT' | 'CREDIT';
}

interface CompanyStatementSummary {
  lines: StatementLine[];
  totalCredit: number;
  totalDebit: number;
  balance: number;
  month: number;
  year: number;
}

@Injectable({ providedIn: 'root' })
export class CompanyDashboardMockService {
  getDashboardData(): Observable<CompanyStatementSummary & { balanceHistory: { name: string, series: { name: string, value: number }[] }[] }> {
    return of({
      totalCredit: 800000,
      totalDebit: 600000,
      balance: 200000,
      month: 6,
      year: 2024,
      lines: [
        {
          label: 'Vente de produits',
          oppositeLabel: 'Client A',
          date: new Date(2024, 5, 2),
          amount: 200000,
          type: 'CREDIT',
        },
        {
          label: 'Achat de matières',
          oppositeLabel: 'Fournisseur B',
          date: new Date(2024, 5, 5),
          amount: 150000,
          type: 'DEBIT',
        },
        {
          label: 'Service externe',
          oppositeLabel: 'Prestataire C',
          date: new Date(2024, 5, 10),
          amount: 100000,
          type: 'DEBIT',
        },
        {
          label: 'Paiement reçu',
          oppositeLabel: 'Client D',
          date: new Date(2024, 5, 15),
          amount: 300000,
          type: 'CREDIT',
        },
        {
          label: 'Frais bancaires',
          oppositeLabel: 'Banque',
          date: new Date(2024, 5, 20),
          amount: 50000,
          type: 'DEBIT',
        },
      ],
      balanceHistory: [
        {
          name: 'Solde',
          series: [
            { name: 'Jan', value: 100000 },
            { name: 'Fév', value: 120000 },
            { name: 'Mar', value: 150000 },
            { name: 'Avr', value: 180000 },
            { name: 'Mai', value: 190000 },
            { name: 'Juin', value: 200000 },
          ]
        }
      ]
    });
  }
}

@Component({
  selector: 'app-company-board',
  templateUrl: './company-board.component.html',
})
export class CompanyBoardComponent implements OnInit {
  dashboardData: (CompanyStatementSummary & { balanceHistory: { name: string, series: { name: string, value: number }[] }[] }) | null = null;

  constructor(private mockService: CompanyDashboardMockService) {}

  ngOnInit(): void {
    this.mockService.getDashboardData().subscribe(data => {
      this.dashboardData = data;
    });
  }

  get chartData() {
    return this.dashboardData?.balanceHistory || [];
  }

  get creditCount() {
    return this.dashboardData?.lines.filter(l => l.type === 'CREDIT').length || 0;
  }
  get debitCount() {
    return this.dashboardData?.lines.filter(l => l.type === 'DEBIT').length || 0;
  }
  get avgTransaction() {
    return this.dashboardData && this.dashboardData.lines.length
      ? this.dashboardData.lines.reduce((sum, l) => sum + l.amount, 0) / this.dashboardData.lines.length
      : 0;
  }
}
