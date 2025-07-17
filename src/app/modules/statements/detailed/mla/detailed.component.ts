import { Component, OnInit } from "@angular/core";
import { Company } from "@core/services/company/company.interface";
import { CompanyService } from "@core/services/company/company.service";
import { CompanyStatementSummary } from "@core/services/statement/company-statement-summary.interface";
import { StatementService } from "@core/services/statement/statement.service";
import { LayoutService } from "@lhacksrt/services/layout/layout.service";

@Component({
    selector: "app-mla-detailed",
    templateUrl: "./detailed.component.html",
})

export class MlaDetailedComponent implements OnInit {

    companies: Company[] = [];
    selectedCompany: Company | null = null;

    selectedMonth = new Date().getMonth() + 1;
    selectedYear = new Date().getFullYear();

    selectingState: boolean = false;

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

    myCompany: Company | null = null;

    constructor(
        private _layoutService: LayoutService,
        private _compagnyService: CompanyService,
        private _statementService: StatementService
    ) {

    }

    ngOnInit(): void {

        this._compagnyService.companies$.subscribe({
            next: (companies) => {
                this.companies = companies;
                console.log("Companies loaded:", this.companies);
            },
            error: (error) => {
                console.error("Error fetching companies:", error);
            }
        });
        this._layoutService.setPageTitle("États détaillés");
        this._layoutService.setCrumbs([
            { title: "États", link: "/statements/detailed" },
            { title: "États détaillés", link: "/statements/detailed" }
        ]);


    }


    // Dans votre component TypeScript
    selectCompany1(company: Company): void {
        this.selectedCompany = company;
        this.statement = null;
        console.log('Company 1 sélectionnée:', company.name);
    }

    selectCompany2(company: Company): void {
        this.myCompany = company;
        this.statement = null;
        console.log('Company 2 sélectionnée:', company.name);
    }

    selectCompany(company: Company): void {
        // Empêcher la sélection de la même compagnie pour les deux
        if (this.selectingState === false) {
            // Sélection de la première compagnie
            if (this.myCompany?.id === company.id) {
                // Si c'est déjà la compagnie 2, on l'enlève d'abord
                this.myCompany = null;
            }
            this.selectCompany1(company);
            this.selectingState = true;
        } else {
            // Sélection de la deuxième compagnie
            if (this.selectedCompany?.id === company.id) {
                // Si c'est déjà la compagnie 1, on l'enlève d'abord
                this.selectedCompany = null;
            }
            this.selectCompany2(company);
            this.selectingState = false;
        }
    }

    // Méthode pour réinitialiser les sélections
    resetSelections(): void {
        this.selectedCompany = null;
        this.myCompany = null;
        this.selectingState = false;
        this.statement = null;
    }

    // Getter pour savoir quelle compagnie on est en train de sélectionner
    get currentSelectionLabel(): string {
        return this.selectingState ? 'Sélectionnez la 2ème compagnie' : 'Sélectionnez la 1ère compagnie';
    }

    loadStatement(): void {
        if (!this.selectedCompany) return;
        if (!this.myCompany) return;

        this._statementService.getDetailedStatementBetween(this.selectedCompany.id, this.myCompany.id, this.selectedMonth, this.selectedYear)
            .subscribe(data => {
                this.statement = data;
            });
    }

    downloadPdf(): void {
        if (!this.selectedCompany) return;
        if (!this.myCompany) return;

        this._statementService.downloadDetailedStatementPdfBetween(this.selectedCompany.id, this.myCompany.id, this.selectedMonth, this.selectedYear)
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