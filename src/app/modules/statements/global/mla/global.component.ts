import { Component, OnInit } from "@angular/core";
import { Company } from "@core/services/company/company.interface";
import { CompanyService } from "@core/services/company/company.service";
import { CompanyCounterpartySummary } from "@core/services/statement/company-counterparty-summary.interface";
import { CompanyGlobalStatementSummary } from "@core/services/statement/company-global-statement-summary.interface";
import { GlobalStatementSummary } from "@core/services/statement/global-statement-summary.interface";
import { StatementService } from "@core/services/statement/statement.service";
import { LayoutService } from "@lhacksrt/services/layout/layout.service";

@Component({
    selector: "app-mla-global",
    templateUrl: "./global.component.html",
})
export class MLAGlobalComponent implements OnInit {

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

    companies: Company[] = [];

    globalLines: CompanyCounterpartySummary[] = [];
    globalBalanceText = '';

    myCompany: Company | null = null;

    constructor(
        private _layoutService: LayoutService,
        private _companyService: CompanyService,
        private _statementService: StatementService
    ) {
        this._companyService.myCompany$.subscribe({
            next: (company) => {
                this.myCompany = company;
            },
            error: (error) => {
                console.error("Error fetching my company:", error);
            }
        });
    }

    ngOnInit(): void {
        this._companyService.companies$.subscribe({
            next: (companies) => {
                this.companies = companies;
                console.log("Companies loaded:", this.companies);
            },
            error: (error) => {
                console.error("Error fetching companies:", error);
            }
        });
        this._layoutService.setPageTitle("États globaux");
        this._layoutService.setCrumbs([
            { title: "États", link: "/statements/global" },
            { title: "États globaux", link: "/statements/global" }
        ]);

        // this.loadGlobalStatement();
    }

    globalStatement: GlobalStatementSummary | null = null;

    selectCompany(company: Company): void {
        this.myCompany = company;
        this.globalStatement = null;
    }

    loadGlobalStatement(): void {
        if (!this.myCompany) return;
        this._statementService.getGlobalStatementBetween(this.myCompany.id, this.selectedMonth, this.selectedYear)
            .subscribe(data => {
                this.globalStatement = data;
                console.log("Global statement loaded:", this.globalStatement);
                this.globalLines = data.counterparties;
                this.globalBalanceText = `de ${data.globalBalance.toLocaleString()} FCFA`;
            });
    }

    downloadPdf(): void {
        if (!this.myCompany) return;
    
        this._statementService.downloadGlobalStatementPdfBetween(this.myCompany.id, this.selectedMonth, this.selectedYear)
            .subscribe(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `statement_${this.myCompany?.name}_${this.selectedMonth}_${this.selectedYear}.pdf`;
                a.click();
                window.URL.revokeObjectURL(url);
            });
    }

}