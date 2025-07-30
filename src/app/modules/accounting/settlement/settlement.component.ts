import { Component, OnInit } from '@angular/core';
import { PERMISSIONS } from '@core/permissions/permissions.data';
import { Company } from '@core/services/company/company.interface';
import { CompanyService } from '@core/services/company/company.service';
import { StatementService } from '@core/services/statement/statement.service';
import { TranslocoService } from '@jsverse/transloco';
import { LayoutService } from '@lhacksrt/services/layout/layout.service';
import { ManagementEntityType } from '../../admin/users/dto';
import { UserService } from '@core/services/user/user.service';
import { 
  AccountingService, 
  QuittanceRequest, 
  QuittanceResponse,
  QuittanceClaimRequest,
  QuittanceClaimResponse,
  EncaissementQuittanceClaimRequest,
  EncaissementQuittanceClaimResponse,
  ModeEncaissementResponse
} from '../accounting.service';
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
  startDate: Date = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  endDate: Date = new Date();
  
  // Données d'annexe
  annexeData: AnnexeItem[] = [];
  totalAmount: number = 0;

  // Quittance data
  quittances: QuittanceResponse[] = [];
  selectedQuittance: QuittanceResponse | null = null;
  quittanceClaims: QuittanceClaimResponse[] = [];
  reglements: EncaissementQuittanceClaimResponse[] = [];
  modesEncaissement: ModeEncaissementResponse[] = [];
  
  loading = false;
  
  // Forms
  quittanceForm!: FormGroup;
  quittanceClaimForm!: FormGroup;
  reglementForm!: FormGroup;
  
  // Selected items for editing
  selectedQuittanceForEdit: QuittanceResponse | null = null;
  selectedQuittanceClaim: QuittanceClaimResponse | null = null;
  selectedReglement: EncaissementQuittanceClaimResponse | null = null;

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
  }

  initializeForms(): void {
    // Quittance form
    this.quittanceForm = this._formBuilder.group({
      numero: ['', Validators.required],
      nature: ['REGLEMENT', Validators.required], // Fixé à REGLEMENT
      montant: [0, [Validators.required, Validators.min(0)]],
      sortQuittance: [null],
      dateSortQuittance: [null]
    });

    // QuittanceClaim form
    this.quittanceClaimForm = this._formBuilder.group({
      quittanceId: ['', Validators.required],
      montant: [0, [Validators.required, Validators.min(0)]],
      payerCompanyId: [null],
      receiverCompanyId: [null],
      claimIds: [[]]
    });

    // Reglement form (similar to encaissement but for settlements)
    this.reglementForm = this._formBuilder.group({
      quittanceClaimId: ['', Validators.required],
      modeEncaissementId: ['', Validators.required],
      montantEncaisse: [0, [Validators.required, Validators.min(0)]],
      dateEncaissement: [new Date(), Validators.required],
      numero: ['']
    });
  }

  ngOnInit(): void {
    this._layoutService.setPageTitle(this._translocoService.translate('layout.titles.quittance_settlement'));
    
    this._layoutService.setCrumbs([
      { title: this._translocoService.translate('layout.crumbs.accounting'), link: '#', active: false },
      { title: this._translocoService.translate('layout.crumbs.quittance_settlement'), link: '/accounting/quittance-settlement', active: true }
    ]);
    
    this.initializeForms();

    this.loadInitialData();
  }

  loadInitialData(): void {
    this.loadCompanies();
    this.loadQuittances();
    this.loadModesEncaissement();
  }

  loadCompanies(): void {
    this._companyService.getCompaniesAll().subscribe(companies => {
      this.companies = companies;
      if (companies.length > 0) {
        this.selectCompany(companies[0]);
      }
    });

    // Auto-select company for Company type users
    this._userService.managementEntity$.subscribe(entity => {
      if (entity && entity.type === ManagementEntityType.COMPANY) {
        this.selectedCompany = entity as Company;
      }
    });
  }

  selectCompany(company: Company): void {
    this.selectedCompany = company;
    this.loadQuittances();
  }

  loadQuittances(): void {
    this.loading = true;
    this._accountingService.getAllQuittances()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (data) => {
          // Filtrer seulement les quittances de règlement
          this.quittances = data.filter(q => q.nature === 'REGLEMENT');
          this.updateAnnexeData();
        },
        error: (error) => {
          this.handleError('common.errors.load_failed', error);
        }
      });
  }

  loadQuittanceClaimsForQuittance(quittanceUuid: string): void {
    this._accountingService.getQuittanceClaimsByQuittance(quittanceUuid)
      .subscribe({
        next: (claims) => {
          this.quittanceClaims = claims;
        },
        error: (error) => {
          this.handleError('common.errors.load_failed', error);
        }
      });
  }

  loadReglementsForQuittanceClaim(quittanceClaimUuid: string): void {
    this._accountingService.getEncaissementsByQuittanceClaim(quittanceClaimUuid)
      .subscribe({
        next: (reglements) => {
          this.reglements = reglements;
        },
        error: (error) => {
          this.handleError('common.errors.load_failed', error);
        }
      });
  }

  loadModesEncaissement(): void {
    this._accountingService.getAllModesEncaissement()
      .subscribe({
        next: (modes) => {
          this.modesEncaissement = modes;
        },
        error: (error) => {
          this.handleError('common.errors.load_failed', error);
        }
      });
  }

  // ============= QUITTANCE METHODS =============

  createQuittance(): void {
    if (this.quittanceForm.invalid) return;

    const request: QuittanceRequest = {
      ...this.quittanceForm.value,
      nature: 'REGLEMENT' // Force la nature à REGLEMENT
    };
    
    this.loading = true;
    this._accountingService.createQuittance(request)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          this.showSuccess('entities.quittance.created_success');
          this.loadQuittances();
          this.resetQuittanceForm();
        },
        error: (error) => {
          this.handleError('common.errors.creation_failed', error);
        }
      });
  }

  updateQuittance(): void {
    if (!this.selectedQuittanceForEdit || this.quittanceForm.invalid) return;

    const request: QuittanceRequest = {
      ...this.quittanceForm.value,
      nature: 'REGLEMENT'
    };
    
    this.loading = true;
    this._accountingService.updateQuittance(this.selectedQuittanceForEdit.uuid, request)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          this.showSuccess('entities.quittance.updated_success');
          this.loadQuittances();
          this.resetQuittanceForm();
        },
        error: (error) => {
          this.handleError('common.errors.update_failed', error);
        }
      });
  }

  deleteQuittance(uuid: string): void {
    if (!confirm(this._translocoService.translate('common.confirmations.delete'))) return;
    
    this.loading = true;
    this._accountingService.deleteQuittance(uuid)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.showSuccess('entities.quittance.deleted_success');
          this.loadQuittances();
        },
        error: (error) => {
          this.handleError('common.errors.delete_failed', error);
        }
      });
  }

  editQuittance(quittance: QuittanceResponse): void {
    this.selectedQuittanceForEdit = quittance;
    this.quittanceForm.patchValue({
      numero: quittance.numero,
      nature: quittance.nature,
      montant: quittance.montant,
      sortQuittance: quittance.sortQuittance,
      dateSortQuittance: quittance.dateSortQuittance ? new Date(quittance.dateSortQuittance) : null
    });
  }

  selectQuittance(quittance: QuittanceResponse): void {
    this.selectedQuittance = quittance;
    this.loadQuittanceClaimsForQuittance(quittance.uuid);
    // Pré-remplir le form de QuittanceClaim
    this.quittanceClaimForm.patchValue({
      quittanceId: quittance.uuid
    });
  }

  // ============= QUITTANCE CLAIM METHODS =============

  createQuittanceClaim(): void {
    if (this.quittanceClaimForm.invalid) return;

    const request: QuittanceClaimRequest = this.quittanceClaimForm.value;
    
    this.loading = true;
    this._accountingService.createQuittanceClaim(request)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          this.showSuccess('entities.quittance_claim.created_success');
          if (this.selectedQuittance) {
            this.loadQuittanceClaimsForQuittance(this.selectedQuittance.uuid);
          }
          this.resetQuittanceClaimForm();
        },
        error: (error) => {
          this.handleError('common.errors.creation_failed', error);
        }
      });
  }

  updateQuittanceClaim(): void {
    if (!this.selectedQuittanceClaim || this.quittanceClaimForm.invalid) return;

    const request: QuittanceClaimRequest = this.quittanceClaimForm.value;
    
    this.loading = true;
    this._accountingService.updateQuittanceClaim(this.selectedQuittanceClaim.uuid, request)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          this.showSuccess('entities.quittance_claim.updated_success');
          if (this.selectedQuittance) {
            this.loadQuittanceClaimsForQuittance(this.selectedQuittance.uuid);
          }
          this.resetQuittanceClaimForm();
        },
        error: (error) => {
          this.handleError('common.errors.update_failed', error);
        }
      });
  }

  deleteQuittanceClaim(uuid: string): void {
    if (!confirm(this._translocoService.translate('common.confirmations.delete'))) return;
    
    this.loading = true;
    this._accountingService.deleteQuittanceClaim(uuid)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.showSuccess('entities.quittance_claim.deleted_success');
          if (this.selectedQuittance) {
            this.loadQuittanceClaimsForQuittance(this.selectedQuittance.uuid);
          }
        },
        error: (error) => {
          this.handleError('common.errors.delete_failed', error);
        }
      });
  }

  editQuittanceClaim(claim: QuittanceClaimResponse): void {
    this.selectedQuittanceClaim = claim;
    this.quittanceClaimForm.patchValue({
      quittanceId: claim.quittance.uuid,
      montant: claim.montant,
      payerCompanyId: claim.payerCompany?.id,
      receiverCompanyId: claim.receiverCompany?.id,
      claimIds: claim.claims?.map(c => c.id) || []
    });
  }

  selectQuittanceClaim(claim: QuittanceClaimResponse): void {
    this.selectedQuittanceClaim = claim;
    this.loadReglementsForQuittanceClaim(claim.uuid);
    // Pré-remplir le form de règlement
    this.reglementForm.patchValue({
      quittanceClaimId: claim.uuid
    });
  }

  // ============= REGLEMENT METHODS =============

  createReglement(): void {
    if (this.reglementForm.invalid) return;

    const request: EncaissementQuittanceClaimRequest = this.reglementForm.value;
    
    this.loading = true;
    this._accountingService.createEncaissement(request)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          this.showSuccess('entities.reglement.created_success');
          if (this.selectedQuittanceClaim) {
            this.loadReglementsForQuittanceClaim(this.selectedQuittanceClaim.uuid);
          }
          this.resetReglementForm();
        },
        error: (error) => {
          this.handleError('common.errors.creation_failed', error);
        }
      });
  }

  updateReglement(): void {
    if (!this.selectedReglement || this.reglementForm.invalid) return;

    const request: EncaissementQuittanceClaimRequest = this.reglementForm.value;
    
    this.loading = true;
    this._accountingService.updateEncaissement(this.selectedReglement.uuid, request)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          this.showSuccess('entities.reglement.updated_success');
          if (this.selectedQuittanceClaim) {
            this.loadReglementsForQuittanceClaim(this.selectedQuittanceClaim.uuid);
          }
          this.resetReglementForm();
        },
        error: (error) => {
          this.handleError('common.errors.update_failed', error);
        }
      });
  }

  deleteReglement(uuid: string): void {
    if (!confirm(this._translocoService.translate('common.confirmations.delete'))) return;
    
    this.loading = true;
    this._accountingService.deleteEncaissement(uuid)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.showSuccess('entities.reglement.deleted_success');
          if (this.selectedQuittanceClaim) {
            this.loadReglementsForQuittanceClaim(this.selectedQuittanceClaim.uuid);
          }
        },
        error: (error) => {
          this.handleError('common.errors.delete_failed', error);
        }
      });
  }

  editReglement(reglement: EncaissementQuittanceClaimResponse): void {
    this.selectedReglement = reglement;
    this.reglementForm.patchValue({
      quittanceClaimId: reglement.quittanceClaim.uuid,
      modeEncaissementId: reglement.modeEncaissement.uuid,
      montantEncaisse: reglement.montantEncaisse,
      dateEncaissement: reglement.dateEncaissement ? new Date(reglement.dateEncaissement) : new Date(),
      numero: reglement.numero
    });
  }

  // ============= PDF GENERATION =============

  generateQuittancePdf(uuid: string): void {
    this.loading = true;
    this._accountingService.generateQuittancePdf(uuid)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (blob) => {
          this.downloadBlob(blob, `quittance-reglement-${uuid}.pdf`);
        },
        error: (error) => {
          this.handleError('common.errors.pdf_generation_failed', error);
        }
      });
  }

  generateEtatReglementPdf(uuid: string): void {
    this.loading = true;
    this._accountingService.generateEtatReglementPdf(uuid)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (blob) => {
          this.downloadBlob(blob, `etat-reglement-${uuid}.pdf`);
        },
        error: (error) => {
          this.handleError('common.errors.pdf_generation_failed', error);
        }
      });
  }

  // ============= FORM RESET METHODS =============

  resetQuittanceForm(): void {
    this.selectedQuittanceForEdit = null;
    this.quittanceForm.reset({
      numero: '',
      nature: 'REGLEMENT',
      montant: 0,
      sortQuittance: null,
      dateSortQuittance: null
    });
  }

  resetQuittanceClaimForm(): void {
    this.selectedQuittanceClaim = null;
    this.quittanceClaimForm.reset({
      quittanceId: this.selectedQuittance?.uuid || '',
      montant: 0,
      payerCompanyId: null,
      receiverCompanyId: null,
      claimIds: []
    });
  }

  resetReglementForm(): void {
    this.selectedReglement = null;
    this.reglementForm.reset({
      quittanceClaimId: this.selectedQuittanceClaim?.uuid || '',
      modeEncaissementId: '',
      montantEncaisse: 0,
      dateEncaissement: new Date(),
      numero: ''
    });
  }

  // ============= UTILITY METHODS =============

  updateAnnexeData(): void {
    this.annexeData = this.quittances.map(quittance => ({
      reference: quittance.numero,
      date: quittance.dateSortQuittance ? new Date(quittance.dateSortQuittance) : new Date(),
      counterpartyName: 'Fournisseur', // À adapter selon vos données
      amount: quittance.montant,
      status: 'PAID' // À adapter selon vos données
    }));

    this.totalAmount = this.annexeData.reduce((sum, item) => sum + item.amount, 0);
  }

  downloadPdf(): void {
    if (!this.selectedCompany) return;

    this._statementService.downloadAnnexePdf(this.selectedCompany.id, this.selectedType, this.startDate, this.endDate)
      .subscribe(blob => {
        const filename = `annexe_reglement_${this.selectedCompany?.name}_${this.formatDate(this.startDate)}_${this.formatDate(this.endDate)}.pdf`;
        this.downloadBlob(blob, filename);
      });
  }

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  private downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  private showSuccess(messageKey: string): void {
    this._snackBar.open(
      this._translocoService.translate(messageKey),
      this._translocoService.translate('buttons.actions.close'),
      { duration: 3000 }
    );
  }

  private handleError(messageKey: string, error: any): void {
    console.error('Error:', error);
    this._snackBar.open(
      this._translocoService.translate(messageKey),
      this._translocoService.translate('buttons.actions.close'),
      { duration: 5000 }
    );
  }
}