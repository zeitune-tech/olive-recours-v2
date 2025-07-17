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

    globalLines: CompanyCounterpartySummary[] = [];
    globalBalanceText = '';

    myCompany!: Company;

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
        this._layoutService.setPageTitle("États globaux");
        this._layoutService.setCrumbs([
            { title: "États", link: "/statements/global" },
            { title: "États globaux", link: "/statements/global" }
        ]);

        this.loadGlobalStatement();
    }

    globalStatement!: GlobalStatementSummary;

    loadGlobalStatement(): void {
        this._statementService.getGlobalStatement(this.selectedMonth, this.selectedYear)
            .subscribe(data => {
                this.globalStatement = data;
                console.log("Global statement loaded:", this.globalStatement);
                this.globalLines = data.counterparties;
                this.globalBalanceText = `de ${data.globalBalance.toLocaleString()} FCFA`;
            });
    }

}