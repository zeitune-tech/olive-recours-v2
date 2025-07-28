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
  selector: 'app-fees',
  templateUrl: './fees.component.html',
})
export class FeesComponent implements OnInit {
  // Permissions et types d'entités
  PERMISSIONS_DATA = PERMISSIONS;
  MANAGEMENT_ENTITY_TYPES = Object.values(ManagementEntityType);

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

  constructor(
    private _layoutService: LayoutService,
    private _statementService: StatementService,
    private _translocoService: TranslocoService,
  ) { }

  ngOnInit(): void {
    // Définir le titre de la page et les fils d'Ariane
    this._layoutService.setPageTitle(this._translocoService.translate('layout.titles.statements'));
    this._layoutService.setCrumbs([
      { title: this._translocoService.translate('layout.crumbs.statements'), link: '#', active: false },
      { title: this._translocoService.translate('layout.crumbs.statements-annexes'), link: '/statements/annexe', active: true }
    ]);
  }

  downloadPdf(): void {
    if(!this.selectedMonth || !this.selectedYear) {
      return;
    }

    this._statementService.downloadFeesStatement(this.selectedMonth, this.selectedYear)
      .subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `frais_gestion_${this.selectedMonth}_${this.selectedYear}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      });

  }

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
