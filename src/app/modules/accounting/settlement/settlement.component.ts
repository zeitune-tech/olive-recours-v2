import { Component, OnInit, OnDestroy } from '@angular/core';
import { PERMISSIONS } from '@core/permissions/permissions.data';
import { ManagementEntity } from '@core/services/management-entity/management-entity.interface';
import { TranslocoService } from '@jsverse/transloco';
import { LayoutService } from '@lhacksrt/services/layout/layout.service';
import { ManagementEntityType } from '../../admin/users/dto';
import { UserService } from '@core/services/user/user.service';
import { QuittanceStatementService, QuittanceStatementSummary } from '../quittance-statement.service';
import { ToastService } from '../../../components/toast/toast.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-settlement',
  templateUrl: './settlement.component.html',
})
export class SettlementComponent implements OnInit, OnDestroy {
  
  PERMISSIONS_DATA = PERMISSIONS;
  MANAGEMENT_ENTITY_TYPES = Object.values(ManagementEntityType);

  selectedMonth = new Date().getMonth() + 1;
  selectedYear = new Date().getFullYear();
  startDate = new Date();
  endDate = new Date();
  
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

  isMonthlyView = true;
  isLoading = false;
  
  reglementStatement?: QuittanceStatementSummary;
  entity?: ManagementEntity;
  
  private destroy$ = new Subject<void>();

  constructor(
    private _layoutService: LayoutService,
    private _quittanceStatementService: QuittanceStatementService,
    private _transloco: TranslocoService,
    private _userService: UserService,
    private _toastService: ToastService
  ) {
    // Initialize date range (current month)
    this.startDate = new Date(this.selectedYear, this.selectedMonth - 1, 1);
    this.endDate = new Date(this.selectedYear, this.selectedMonth, 0);
    
    this._userService.managementEntity$
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: ManagementEntity) => {
        this.entity = entity;
      });
  }

  ngOnInit(): void {
    this._layoutService.setPageTitle(this._transloco.translate('layout.titles.settlement'));
    this._layoutService.setCrumbs([
      { title: this._transloco.translate('layout.crumbs.accounting'), link: '#', active: false },
      { title: this._transloco.translate('layout.crumbs.settlement'), link: '/accounting/settlement', active: true }
    ]);
    
    // Load data only when component is initialized
    if (this.entity) {
      this.loadReglementStatement();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadReglementStatement(): void {
    if (!this.entity) return;
    
    this.isLoading = true;
    
    const loadStatement$ = this.isMonthlyView 
      ? this._quittanceStatementService.getMonthlyReglementStatement(
          this.entity.id, 
          this.selectedMonth, 
          this.selectedYear
        )
      : this._quittanceStatementService.getReglementStatement(
          this.entity.id,
          this.startDate.toISOString(),
          this.endDate.toISOString()
        );

    loadStatement$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.reglementStatement = data;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading reglement statement:', error);
          this._toastService.show('error','Erreur lors du chargement de l\'état de règlement');
          this.isLoading = false;
        }
      });
  }

  downloadPdf(): void {
    if (!this.entity) return;
    
    this.isLoading = true;
    
    const downloadPdf$ = this.isMonthlyView
      ? this._quittanceStatementService.downloadMonthlyReglementStatementPdf(
          this.entity.id,
          this.selectedMonth,
          this.selectedYear
        )
      : this._quittanceStatementService.downloadReglementStatementPdf(
          this.entity.id,
          this.startDate.toISOString(),
          this.endDate.toISOString()
        );

    downloadPdf$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const fileName = this.isMonthlyView 
            ? `reglement_${this.selectedMonth}_${this.selectedYear}.pdf`
            : `reglement_${this.startDate.toISOString().split('T')[0]}_${this.endDate.toISOString().split('T')[0]}.pdf`;
          a.download = fileName;
          a.click();
          window.URL.revokeObjectURL(url);
          this.isLoading = false;
          this._toastService.show('success','PDF téléchargé avec succès');
        },
        error: (error) => {
          console.error('Error downloading PDF:', error);
          this._toastService.show('error','Erreur lors du téléchargement du PDF');
          this.isLoading = false;
        }
      });
  }

  onViewModeChange(): void {
    this.loadReglementStatement();
  }

  onDateRangeChange(): void {
    if (!this.isMonthlyView) {
      this.loadReglementStatement();
    }
  }

  onMonthYearChange(): void {
    if (this.isMonthlyView) {
      this.loadReglementStatement();
    }
  }

  getTotalSettled(): number {
    if (!this.reglementStatement?.quittanceLines) {
      return 0;
    }
    return this.reglementStatement.quittanceLines.reduce((sum, line) => sum + line.totalMontantEncaisse, 0);
  }

}