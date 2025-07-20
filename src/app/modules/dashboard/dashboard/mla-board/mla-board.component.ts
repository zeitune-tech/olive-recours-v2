import { Component, OnInit, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

interface CompanyCounterpartySummary {
  counterpartyCompany: string;
  counterpartyLogo: string | null;
  totalDebit: number;
  totalCredit: number;
  balance: number;
}

interface GlobalStatementSummary {
  companyName: string;
  companyLogo: string;
  month: number;
  year: number;
  federationName: string;
  federationLogo: string;
  totalDebit: number;
  totalCredit: number;
  globalBalance: number;
  counterparties: CompanyCounterpartySummary[];
}

@Injectable({ providedIn: 'root' })
export class MlaDashboardMockService {
  getDashboardData(): Observable<GlobalStatementSummary & { balanceHistory: { name: string, series: { name: string, value: number }[] }[] }> {
    return of({
      companyName: 'Market Federation',
      companyLogo: 'assets/images/logo/logo.png',
      month: 6,
      year: 2024,
      federationName: 'Federation X',
      federationLogo: 'assets/images/logo/logo.png',
      totalDebit: 1200000,
      totalCredit: 950000,
      globalBalance: 250000,
      counterparties: [
        {
          counterpartyCompany: 'Company A',
          counterpartyLogo: null,
          totalDebit: 400000,
          totalCredit: 300000,
          balance: 100000,
        },
        {
          counterpartyCompany: 'Company B',
          counterpartyLogo: null,
          totalDebit: 500000,
          totalCredit: 400000,
          balance: 100000,
        },
        {
          counterpartyCompany: 'Company C',
          counterpartyLogo: null,
          totalDebit: 300000,
          totalCredit: 250000,
          balance: 50000,
        },
      ],
      balanceHistory: [
        {
          name: 'Solde Global',
          series: [
            { name: 'Jan', value: 100000 },
            { name: 'Fév', value: 120000 },
            { name: 'Mar', value: 150000 },
            { name: 'Avr', value: 180000 },
            { name: 'Mai', value: 210000 },
            { name: 'Juin', value: 250000 },
          ]
        }
      ]
    });
  }
}

@Component({
  selector: 'app-mla-board',
  templateUrl: './mla-board.component.html',
})
export class MlaBoardComponent implements OnInit {
  dashboardData: (GlobalStatementSummary & { balanceHistory: { name: string, series: { name: string, value: number }[] }[] }) | null = null;

  constructor(private mockService: MlaDashboardMockService) {}

  ngOnInit(): void {
    this.mockService.getDashboardData().subscribe(data => {
      this.dashboardData = data;
    });
  }

  get chartData() {
    return this.dashboardData?.balanceHistory || [];
  }
}
