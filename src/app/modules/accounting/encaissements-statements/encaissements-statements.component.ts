import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PERMISSIONS } from '@core/permissions/permissions.data';
import { ManagementEntity } from '@core/services/management-entity/management-entity.interface';
import { TranslocoService } from '@jsverse/transloco';
import { LayoutService } from '@lhacksrt/services/layout/layout.service';
import { ManagementEntityType } from '../../admin/users/dto';
import { UserService } from '@core/services/user/user.service';
import { ToastService } from '../../../components/toast/toast.service';
import { CompanyService } from '@core/services/company/company.service';
import { Company } from '@core/services/company/company.interface';
import { 
  QuittanceStatementService, 
  QuittanceStatementSummary, 
  EncaissementStatementSummary 
} from '../quittance-statement.service';

@Component({
  selector: 'app-encaissements-statements',
  templateUrl: './encaissements-statements.component.html',
  styleUrls: ['./encaissements-statements.component.scss']
})
export class EncaissementsStatementsComponent implements OnInit, OnDestroy {

  PERMISSIONS_DATA = PERMISSIONS;
  
  filterForm!: FormGroup;
  
  companies: Company[] = [];
  entity?: ManagementEntity;
  
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
  
  years: number[] = [];
  
  // Statement results
  currentEncaissementStatement?: QuittanceStatementSummary;
  currentReglementStatement?: QuittanceStatementSummary;
  currentEnhancedStatement?: EncaissementStatementSummary;
  
  loading = false;
  currentStatementType: 'encaissement' | 'reglement' | 'enhanced' | null = null;
  
  displayedColumns: string[] = [];
  isQuittanceStatement = false;
  isEncaissementStatement = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private _layoutService: LayoutService,
    private _transloco: TranslocoService,
    private _userService: UserService,
    private _toastService: ToastService,
    private _companyService: CompanyService,
    private _quittanceStatementService: QuittanceStatementService
  ) {
    this.initializeForm();
    this.initializeYears();
  }

  ngOnInit(): void {
    this._layoutService.setPageTitle(this._transloco.translate('layout.titles.encaissementsStatements'));
    this._layoutService.setCrumbs([
      { title: this._transloco.translate('layout.crumbs.accounting'), link: '#', active: false },
      { title: this._transloco.translate('layout.crumbs.encaissementsStatements'), link: '/accounting/encaissements-statements', active: true }
    ]);

    this._userService.managementEntity$
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: ManagementEntity | null) => {
        this.entity = entity || undefined;
        
        if (entity?.type === ManagementEntityType.MARKET_LEVEL_ORGANIZATION) {
          this.loadCompanies();
        } else if (entity?.type === ManagementEntityType.COMPANY) {
          // Pre-populate company UUID for company users
          this.filterForm.patchValue({ companyUuid: entity.id });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    const currentDate = new Date();
    
    this.filterForm = this.fb.group({
      companyUuid: ['', Validators.required],
      periodType: ['monthly', Validators.required],
      month: [currentDate.getMonth() + 1],
      year: [currentDate.getFullYear()],
      startDate: [new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)],
      endDate: [new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)]
    });
  }

  private initializeYears(): void {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear - 5; year <= currentYear + 1; year++) {
      this.years.push(year);
    }
  }

  private loadCompanies(): void {
    this._companyService.getCompaniesAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (companies) => {
          this.companies = companies;
        },
        error: (error) => {
          console.error('Error loading companies:', error);
          this._toastService.show('error', 'Erreur lors du chargement des compagnies');
        }
      });
  }

  generateEncaissementStatement(): void {
    if (!this.filterForm.valid) {
      this._toastService.show('warn', 'Veuillez remplir tous les champs requis');
      return;
    }

    this.loading = true;
    this.currentStatementType = 'encaissement';
    this.clearCurrentStatements();

    const formValue = this.filterForm.value;
    const isMonthly = formValue.periodType === 'monthly';

    const statement$ = isMonthly
      ? this._quittanceStatementService.getMonthlyEncaissementStatement(
          formValue.companyUuid,
          formValue.month,
          formValue.year
        )
      : this._quittanceStatementService.getEncaissementStatement(
          formValue.companyUuid,
          formValue.startDate.toISOString(),
          formValue.endDate.toISOString()
        );

    statement$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.currentEncaissementStatement = data;
          this.setupTableForQuittanceStatement();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading encaissement statement:', error);
          this._toastService.show('error', 'Erreur lors du chargement de l\'état d\'encaissement');
          this.loading = false;
        }
      });
  }

  generateReglementStatement(): void {
    if (!this.filterForm.valid) {
      this._toastService.show('warn', 'Veuillez remplir tous les champs requis');
      return;
    }

    this.loading = true;
    this.currentStatementType = 'reglement';
    this.clearCurrentStatements();

    const formValue = this.filterForm.value;
    const isMonthly = formValue.periodType === 'monthly';

    const statement$ = isMonthly
      ? this._quittanceStatementService.getMonthlyReglementStatement(
          formValue.companyUuid,
          formValue.month,
          formValue.year
        )
      : this._quittanceStatementService.getReglementStatement(
          formValue.companyUuid,
          formValue.startDate.toISOString(),
          formValue.endDate.toISOString()
        );

    statement$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.currentReglementStatement = data;
          this.setupTableForQuittanceStatement();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading reglement statement:', error);
          this._toastService.show('error', 'Erreur lors du chargement de l\'état de règlement');
          this.loading = false;
        }
      });
  }

  generateEncaissementsStatement(): void {
    if (!this.filterForm.valid) {
      this._toastService.show('warn', 'Veuillez remplir tous les champs requis');
      return;
    }

    this.loading = true;
    this.currentStatementType = 'enhanced';
    this.clearCurrentStatements();

    const formValue = this.filterForm.value;
    const isMonthly = formValue.periodType === 'monthly';

    const statement$ = isMonthly
      ? this._quittanceStatementService.getMonthlyEnhancedEncaissementStatement(
          formValue.companyUuid,
          formValue.month,
          formValue.year
        )
      : this._quittanceStatementService.getEnhancedEncaissementStatement(
          formValue.companyUuid,
          formValue.startDate.toISOString(),
          formValue.endDate.toISOString()
        );

    statement$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.currentEnhancedStatement = data;
          this.setupTableForEncaissementStatement();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading encaissements statement:', error);
          this._toastService.show('error', 'Erreur lors du chargement de l\'état des encaissements');
          this.loading = false;
        }
      });
  }

  downloadPdf(): void {
    if (!this.currentStatementType || this.loading) return;

    if (!this.filterForm.valid) {
      this._toastService.show('warn', 'Veuillez générer un état avant de télécharger');
      return;
    }

    this.loading = true;
    const formValue = this.filterForm.value;
    const isMonthly = formValue.periodType === 'monthly';

    let downloadObservable;

    switch (this.currentStatementType) {
      case 'encaissement':
        downloadObservable = isMonthly
          ? this._quittanceStatementService.downloadMonthlyEncaissementStatementPdf(
              formValue.companyUuid, formValue.month, formValue.year
            )
          : this._quittanceStatementService.downloadEncaissementStatementPdf(
              formValue.companyUuid, formValue.startDate.toISOString(), formValue.endDate.toISOString()
            );
        break;
      case 'reglement':
        downloadObservable = isMonthly
          ? this._quittanceStatementService.downloadMonthlyReglementStatementPdf(
              formValue.companyUuid, formValue.month, formValue.year
            )
          : this._quittanceStatementService.downloadReglementStatementPdf(
              formValue.companyUuid, formValue.startDate.toISOString(), formValue.endDate.toISOString()
            );
        break;
      case 'enhanced':
        downloadObservable = isMonthly
          ? this._quittanceStatementService.downloadMonthlyEncaissementsStatementPdf(
              formValue.companyUuid, formValue.month, formValue.year
            )
          : this._quittanceStatementService.downloadEncaissementsStatementPdf(
              formValue.companyUuid, formValue.startDate.toISOString(), formValue.endDate.toISOString()
            );
        break;
      default:
        this._toastService.show('error', 'Type d\'état non supporté');
        this.loading = false;
        return;
    }

    downloadObservable
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const fileName = this.generateFileName();
          a.download = fileName;
          a.click();
          window.URL.revokeObjectURL(url);
          this.loading = false;
          this._toastService.show('success', 'PDF téléchargé avec succès');
        },
        error: (error) => {
          console.error('Error downloading PDF:', error);
          this._toastService.show('error', 'Erreur lors du téléchargement du PDF');
          this.loading = false;
        }
      });
  }

  private generateFileName(): string {
    const formValue = this.filterForm.value;
    const isMonthly = formValue.periodType === 'monthly';
    const company = this.companies.find(c => c.id === formValue.companyUuid);
    const companyCode = company?.acronym || 'COMP';
    
    const datePart = isMonthly
      ? `${formValue.month}_${formValue.year}`
      : `${formValue.startDate.toISOString().split('T')[0]}_${formValue.endDate.toISOString().split('T')[0]}`;

    return `${this.currentStatementType}_${companyCode}_${datePart}.pdf`;
  }

  private clearCurrentStatements(): void {
    this.currentEncaissementStatement = undefined;
    this.currentReglementStatement = undefined;
    this.currentEnhancedStatement = undefined;
  }

  private setupTableForQuittanceStatement(): void {
    this.isQuittanceStatement = true;
    this.isEncaissementStatement = false;
    this.displayedColumns = ['numero', 'montant', 'date', 'nombreEncaissements'];
  }

  private setupTableForEncaissementStatement(): void {
    this.isQuittanceStatement = false;
    this.isEncaissementStatement = true;
    this.displayedColumns = ['numero', 'montant', 'date', 'typeEncaissement'];
  }

  get currentStatement(): QuittanceStatementSummary | EncaissementStatementSummary | undefined {
    return this.currentEncaissementStatement || this.currentReglementStatement || this.currentEnhancedStatement;
  }

  get hasCurrentStatement(): boolean {
    return !!(this.currentEncaissementStatement || this.currentReglementStatement || this.currentEnhancedStatement);
  }

  isMLA(): boolean {
    return this.entity?.type === ManagementEntityType.MARKET_LEVEL_ORGANIZATION;
  }
}