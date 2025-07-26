import { Component, OnInit } from '@angular/core';
import { PERMISSIONS } from '@core/permissions/permissions.data';
import { Company } from '@core/services/company/company.interface';
import { CompanyService } from '@core/services/company/company.service';
import { StatementService } from '@core/services/statement/statement.service';
import { TranslocoService } from '@jsverse/transloco';
import { LayoutService } from '@lhacksrt/services/layout/layout.service';
import { ManagementEntityType } from '../../admin/users/dto';
import { UserService } from '@core/services/user/user.service';

interface AnnexeItem {
  reference: string;
  date: Date;
  counterpartyName: string;
  counterpartyLogo?: string;
  amount: number;
  status: 'PAID' | 'UNPAID' | 'PARTIAL';
}

@Component({
  selector: 'app-settlement',
  templateUrl: './settlement.component.html',
})
export class SettlementComponent implements OnInit {
  // Permissions et types d'entités
  PERMISSIONS_DATA = PERMISSIONS;
  MANAGEMENT_ENTITY_TYPES = Object.values(ManagementEntityType);

  // Données des compagnies
  companies: Company[] = [];
  selectedCompany: Company | null = null;
  
  // Type d'annexe
  selectedType: 'ALL' | 'TO_PAY' | 'TO_RECEIVE' = 'ALL';
  
  // Période
  startDate: Date = new Date(new Date().getFullYear(), new Date().getMonth(), 1); // Premier jour du mois courant
  endDate: Date = new Date(); // Aujourd'hui
  
  // Données d'annexe
  annexeData: AnnexeItem[] = [];
  totalAmount: number = 0;

  constructor(
    private _layoutService: LayoutService,
    private _companyService: CompanyService,
    private _statementService: StatementService,
    private _translocoService: TranslocoService,
    private _userService: UserService
  ) {}

  ngOnInit(): void {
    // Définir le titre de la page et les fils d'Ariane
    this._layoutService.setPageTitle(this._translocoService.translate('layout.titles.statements'));
    this._layoutService.setCrumbs([
      { title: this._translocoService.translate('layout.crumbs.statements'), link: '#', active: false },
      { title: this._translocoService.translate('layout.crumbs.statements-annexes'), link: '/statements/annexe', active: true }
    ]);

    // Charger la liste des compagnies
    this._companyService.companies$.subscribe({
      next: (companies) => {
        this.companies = companies;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des compagnies:', error);
      }
    });

    // Pour le profil Company, définir automatiquement la compagnie sélectionnée
    this._userService.managementEntity$.subscribe(entity => {
      if (entity && entity.type === ManagementEntityType.COMPANY) {
        this.selectedCompany = entity as Company;
      }
    });
  }

  /**
   * Sélectionner une compagnie (pour le profil MLA)
   */
  selectCompany(company: Company): void {
    this.selectedCompany = company;
    this.annexeData = []; // Réinitialiser les données d'annexe
  }

  /**
   * Télécharger le PDF des annexes
   */
  downloadPdf(): void {
    if (!this.selectedCompany) {
      return;
    }

    this._statementService.downloadAnnexePdf(this.selectedCompany.id, this.selectedType, this.startDate, this.endDate)
      .subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `annexe_${this.selectedCompany?.name}_${this.formatDate(this.startDate)}_${this.formatDate(this.endDate)}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      });

  }

  /**
   * Formater une date en chaîne de caractères (format: jj/mm/aaaa)
   */
  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }


}
