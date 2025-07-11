import { Component, OnInit } from "@angular/core";
import { Company } from "@core/services/company/company.interface";
import { CompanyService } from "@core/services/company/company.service";
import { CompanyStatementSummary } from "@core/services/statement/company-statement-summary.interface";
import { StatementService } from "@core/services/statement/statement.service";
import { LayoutService } from "@lhacksrt/services/layout/layout.service";

@Component({
    selector: "app-statements-detailed",
    templateUrl: "./detailed.component.html",
})

export class DetailedComponent implements OnInit {

    companies: Company[] = [];
  selectedCompany: Company | null = null;

  selectedMonth = new Date().getMonth() + 1;
  selectedYear = new Date().getFullYear();

  months = [
    { value: 1, label: 'Janvier' },
    { value: 2, label: 'Février' },
    { value: 3, label: 'Mars' },
    { value: 4, label: 'Avril' },
    { value: 5, label: 'Mai' },
    { value: 6, label: 'Juin' },
    { value: 7, label: 'Juillet' },
    { value: 8, label: 'Août' },
    { value: 9, label: 'Septembre' },
    { value: 10, label: 'Octobre' },
    { value: 11, label: 'Novembre' },
    { value: 12, label: 'Décembre' },
  ];

  statement: CompanyStatementSummary | null = null;

  myCompany!: Company;

    constructor(
        private _layoutService: LayoutService,
        private _compagnyService: CompanyService,
        private _statementService: StatementService
    ) {

        this._compagnyService.companies$.subscribe({
            next: (companies) => {
                this.companies = companies;
                console.log("Companies loaded:", this.companies);
            },
            error: (error) => {
                console.error("Error fetching companies:", error);
            }
        });

        this._compagnyService.myCompany$.subscribe({
            next: (company) => {
                this.myCompany = company;
                console.log("My company loaded:", this.myCompany);
            },
            error: (error) => {
                console.error("Error fetching my company:", error);
            }
        })
    }

    ngOnInit(): void {
        this._layoutService.setPageTitle("États détaillés");
        this._layoutService.setCrumbs([
            { title: "États", link: "/statements/detailed" },
            { title: "États détaillés", link: "/statements/detailed" }
        ]);

        
    }


  selectCompany(company: Company): void {
    this.selectedCompany = company;
    this.statement = null;
  }

  loadStatement(): void {
    if (!this.selectedCompany) return;

    this._statementService.getDetailedStatement(this.selectedCompany.id, this.selectedMonth, this.selectedYear)
      .subscribe(data => {
        this.statement = data;
      });
  }

    downloadPdf(): void {
        if (!this.selectedCompany) return;
    
        this._statementService.downloadDetailedStatementPdf(this.selectedCompany.id, this.selectedMonth, this.selectedYear)
        .subscribe(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `statement_${this.selectedCompany?.name}_${this.selectedMonth}_${this.selectedYear}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
        });
    }
}