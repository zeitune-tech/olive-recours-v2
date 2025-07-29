import { Component, OnInit } from '@angular/core';
import { PERMISSIONS } from '@core/permissions/permissions.data';
import { Company } from '@core/services/company/company.interface';
import { CompanyService } from '@core/services/company/company.service';
import { StatementService } from '@core/services/statement/statement.service';
import { TranslocoService } from '@jsverse/transloco';
import { LayoutService } from '@lhacksrt/services/layout/layout.service';
import { ManagementEntityType } from '../../admin/users/dto';
import { UserService } from '@core/services/user/user.service';
import { AccountingService, EncaissementQuittanceResponseDto, EncaissementQuittanceRequestDto } from '../accounting.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

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

  // Settlement data
  settlements: EncaissementQuittanceResponseDto[] = [];
  loading = false;
  settlementForm: FormGroup;
  selectedSettlement: EncaissementQuittanceResponseDto | null = null;

  constructor(
    private _layoutService: LayoutService,
    private _companyService: CompanyService,
    private _statementService: StatementService,
    private _translocoService: TranslocoService,
    private _userService: UserService,
    private _accountingService: AccountingService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _formBuilder: FormBuilder
  ) {
    this.settlementForm = this._formBuilder.group({
      quittanceUuid: ['', Validators.required],
      montant: [0, [Validators.required, Validators.min(0)]],
      dateEncaissement: [new Date(), Validators.required],
      modeReglement: ['', Validators.required],
      reference: [''],
      commentaire: ['']
    });
  }



  loadCompanies(): void {
    this._companyService.getCompaniesAll().subscribe(companies => {
      this.companies = companies;
      if (companies.length > 0) {
        this.selectCompany(companies[0]);
      }
    });
  }

  selectCompany(company: Company): void {
    this.selectedCompany = company;
    this.loadSettlements();
  }

  loadSettlements(): void {
    if (!this.selectedCompany) return;
    
    this.loading = true;
    this._accountingService.getAllEncashments()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (data) => {
          this.settlements = data;
          this.updateAnnexeData();
        },
        error: (error) => {
          console.error('Error loading settlements', error);
          this._snackBar.open(
            this._translocoService.translate('common.errors.load_failed'),
            this._translocoService.translate('common.actions.close'),
            { duration: 5000 }
          );
        }
      });
  }

  updateAnnexeData(): void {
    // Transform settlements to annexe items for display
    this.annexeData = this.settlements.map(settlement => ({
      reference: settlement.reference || '',
      date: settlement.dateEncaissement ? new Date(settlement.dateEncaissement) : new Date(),
      counterpartyName: 'Client', // This should be replaced with actual data
      amount: settlement.montant || 0,
      status: 'PAID' // This should be determined based on actual data
    }));

    // Filter by type if needed
    if (this.selectedType !== 'ALL') {
      // Implement filtering logic based on selectedType
    }

    // Calculate total amount
    this.totalAmount = this.annexeData.reduce((sum, item) => sum + item.amount, 0);
  }

  createSettlement(): void {
    if (this.settlementForm.invalid) {
      return;
    }

    const requestDto: EncaissementQuittanceRequestDto = this.settlementForm.value;
    
    this.loading = true;
    this._accountingService.createEncashment(requestDto)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          this._snackBar.open(
            this._translocoService.translate('entities.settlement.created_success'),
            this._translocoService.translate('common.actions.close'),
            { duration: 3000 }
          );
          this.loadSettlements();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error creating settlement', error);
          this._snackBar.open(
            this._translocoService.translate('common.errors.creation_failed'),
            this._translocoService.translate('common.actions.close'),
            { duration: 5000 }
          );
        }
      });
  }

  updateSettlement(): void {
    if (!this.selectedSettlement || !this.selectedSettlement.uuid || this.settlementForm.invalid) {
      return;
    }

    const requestDto: EncaissementQuittanceRequestDto = this.settlementForm.value;
    
    this.loading = true;
    this._accountingService.updateEncashment(this.selectedSettlement.uuid, requestDto)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          this._snackBar.open(
            this._translocoService.translate('entities.settlement.updated_success'),
            this._translocoService.translate('common.actions.close'),
            { duration: 3000 }
          );
          this.loadSettlements();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error updating settlement', error);
          this._snackBar.open(
            this._translocoService.translate('common.errors.update_failed'),
            this._translocoService.translate('common.actions.close'),
            { duration: 5000 }
          );
        }
      });
  }

  deleteSettlement(uuid: string): void {
    if (!uuid) return;
    
    if (!confirm(this._translocoService.translate('common.confirmations.delete'))) {
      return;
    }
    
    this.loading = true;
    this._accountingService.deleteEncashment(uuid)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this._snackBar.open(
            this._translocoService.translate('entities.settlement.deleted_success'),
            this._translocoService.translate('common.actions.close'),
            { duration: 3000 }
          );
          this.loadSettlements();
        },
        error: (error) => {
          console.error('Error deleting settlement', error);
          this._snackBar.open(
            this._translocoService.translate('common.errors.delete_failed'),
            this._translocoService.translate('common.actions.close'),
            { duration: 5000 }
          );
        }
      });
  }

  generateEtatEncaissementPdf(uuid: string): void {
    if (!uuid) return;
    
    this.loading = true;
    this._accountingService.generateEtatEncaissementPdf(uuid)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `etat-encaissement-${uuid}.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();
        },
        error: (error) => {
          console.error('Error generating PDF', error);
          this._snackBar.open(
            this._translocoService.translate('common.errors.pdf_generation_failed'),
            this._translocoService.translate('common.actions.close'),
            { duration: 5000 }
          );
        }
      });
  }

  generateEtatReglementPdf(uuid: string): void {
    if (!uuid) return;
    
    this.loading = true;
    this._accountingService.generateEtatReglementPdf(uuid)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `etat-reglement-${uuid}.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();
        },
        error: (error) => {
          console.error('Error generating PDF', error);
          this._snackBar.open(
            this._translocoService.translate('common.errors.pdf_generation_failed'),
            this._translocoService.translate('common.actions.close'),
            { duration: 5000 }
          );
        }
      });
  }

  editSettlement(settlement: EncaissementQuittanceResponseDto): void {
    this.selectedSettlement = settlement;
    this.settlementForm.patchValue({
      quittanceUuid: settlement.quittanceUuid,
      montant: settlement.montant,
      dateEncaissement: settlement.dateEncaissement ? new Date(settlement.dateEncaissement) : new Date(),
      modeReglement: settlement.modeReglement,
      reference: settlement.reference,
      commentaire: settlement.commentaire
    });
  }

  resetForm(): void {
    this.selectedSettlement = null;
    this.settlementForm.reset({
      quittanceUuid: '',
      montant: 0,
      dateEncaissement: new Date(),
      modeReglement: '',
      reference: '',
      commentaire: ''
    });
  }

  ngOnInit(): void {
    // Définir le titre de la page et les fils d'Ariane
    this._layoutService.setPageTitle(this._translocoService.translate('layout.titles.statements'));
    
    // Load initial data
    this.loadCompanies();
    this.loadSettlements();
    
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
