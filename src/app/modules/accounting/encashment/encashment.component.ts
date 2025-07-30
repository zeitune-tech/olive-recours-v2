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
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
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
  selector: 'app-encashment',
  templateUrl: './encashment.component.html',
})
export class EncashmentComponent implements OnInit {
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
  encaissements: EncaissementQuittanceClaimResponse[] = [];
  modesEncaissement: ModeEncaissementResponse[] = [];
  
  loading = false;
  
  // Forms
  quittanceForm!: FormGroup;
  quittanceClaimForm!: FormGroup;
  encaissementForm!: FormGroup;
  
  // Selected items for editing
  selectedQuittanceForEdit: QuittanceResponse | null = null;
  selectedQuittanceClaim: QuittanceClaimResponse | null = null;
  selectedEncaissement: EncaissementQuittanceClaimResponse | null = null;

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
      nature: ['ENCAISSEMENT', Validators.required], // Fixé à ENCAISSEMENT
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

    // Encaissement form
    this.encaissementForm = this._formBuilder.group({
      quittanceClaimId: ['', Validators.required],
      modeEncaissementId: ['', Validators.required],
      montantEncaisse: [0, [Validators.required, Validators.min(0)]],
      dateEncaissement: [new Date(), Validators.required],
      numero: ['']
    });
  }

  ngOnInit(): void {
    this._layoutService.setPageTitle(this._translocoService.translate('layout.titles.quittance_encashment'));
    
    this._layoutService.setCrumbs([
      { title: this._translocoService.translate('layout.crumbs.accounting'), link: '#', active: false },
      { title: this._translocoService.translate('layout.crumbs.quittance_encashment'), link: '/accounting/quittance-encashment', active: true }
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
          // Filtrer seulement les quittances d'encaissement
          this.quittances = data.filter(q => q.nature === 'ENCAISSEMENT');
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

  loadEncaissementsForQuittanceClaim(quittanceClaimUuid: string): void {
    this._accountingService.getEncaissementsByQuittanceClaim(quittanceClaimUuid)
      .subscribe({
        next: (encaissements) => {
          this.encaissements = encaissements;
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
      nature: 'ENCAISSEMENT' // Force la nature à ENCAISSEMENT
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
      nature: 'ENCAISSEMENT'
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
    this.loadEncaissementsForQuittanceClaim(claim.uuid);
    // Pré-remplir le form d'encaissement
    this.encaissementForm.patchValue({
      quittanceClaimId: claim.uuid
    });
  }

  // ============= ENCAISSEMENT METHODS =============

  createEncaissement(): void {
    if (this.encaissementForm.invalid) return;

    const request: EncaissementQuittanceClaimRequest = this.encaissementForm.value;
    
    this.loading = true;
    this._accountingService.createEncaissement(request)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          this.showSuccess('entities.encaissement.created_success');
          if (this.selectedQuittanceClaim) {
            this.loadEncaissementsForQuittanceClaim(this.selectedQuittanceClaim.uuid);
          }
          this.resetEncaissementForm();
        },
        error: (error) => {
          this.handleError('common.errors.creation_failed', error);
        }
      });
  }

  updateEncaissement(): void {
    if (!this.selectedEncaissement || this.encaissementForm.invalid) return;

    const request: EncaissementQuittanceClaimRequest = this.encaissementForm.value;
    
    this.loading = true;
    this._accountingService.updateEncaissement(this.selectedEncaissement.uuid, request)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          this.showSuccess('entities.encaissement.updated_success');
          if (this.selectedQuittanceClaim) {
            this.loadEncaissementsForQuittanceClaim(this.selectedQuittanceClaim.uuid);
          }
          this.resetEncaissementForm();
        },
        error: (error) => {
          this.handleError('common.errors.update_failed', error);
        }
      });
  }

  deleteEncaissement(uuid: string): void {
    if (!confirm(this._translocoService.translate('common.confirmations.delete'))) return;
    
    this.loading = true;
    this._accountingService.deleteEncaissement(uuid)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.showSuccess('entities.encaissement.deleted_success');
          if (this.selectedQuittanceClaim) {
            this.loadEncaissementsForQuittanceClaim(this.selectedQuittanceClaim.uuid);
          }
        },
        error: (error) => {
          this.handleError('common.errors.delete_failed', error);
        }
      });
  }

  editEncaissement(encaissement: EncaissementQuittanceClaimResponse): void {
    this.selectedEncaissement = encaissement;
    this.encaissementForm.patchValue({
      quittanceClaimId: encaissement.quittanceClaim.uuid,
      modeEncaissementId: encaissement.modeEncaissement.uuid,
      montantEncaisse: encaissement.montantEncaisse,
      dateEncaissement: encaissement.dateEncaissement ? new Date(encaissement.dateEncaissement) : new Date(),
      numero: encaissement.numero
    });
  }

  // ============= PDF GENERATION =============

  generateQuittancePdf(uuid: string): void {
    this.loading = true;
    this._accountingService.generateQuittancePdf(uuid)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (blob) => {
          this.downloadBlob(blob, `quittance-${uuid}.pdf`);
        },
        error: (error) => {
          this.handleError('common.errors.pdf_generation_failed', error);
        }
      });
  }

  generateEtatEncaissementPdf(uuid: string): void {
    this.loading = true;
    this._accountingService.generateEtatEncaissementPdf(uuid)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (blob) => {
          this.downloadBlob(blob, `etat-encaissement-${uuid}.pdf`);
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
      nature: 'ENCAISSEMENT',
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

  resetEncaissementForm(): void {
    this.selectedEncaissement = null;
    this.encaissementForm.reset({
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
      counterpartyName: 'Client', // À adapter selon vos données
      amount: quittance.montant,
      status: 'PAID' // À adapter selon vos données
    }));

    this.totalAmount = this.annexeData.reduce((sum, item) => sum + item.amount, 0);
  }

  downloadPdf(): void {
    if (!this.selectedCompany) return;

    this._statementService.downloadAnnexePdf(this.selectedCompany.id, this.selectedType, this.startDate, this.endDate)
      .subscribe(blob => {
        const filename = `annexe_encaissement_${this.selectedCompany?.name}_${this.formatDate(this.startDate)}_${this.formatDate(this.endDate)}.pdf`;
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