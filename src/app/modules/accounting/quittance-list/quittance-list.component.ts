import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, forkJoin, of } from 'rxjs';
import { takeUntil, switchMap, catchError, map } from 'rxjs/operators';
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
  EncaissementQuittanceService,
  EncaissementQuittanceResponse
} from '../encaissement-quittance.service';
import {AccountingService, QuittanceResponse} from '../accounting.service';
import { EncaissementDialogComponent, EncaissementDialogData } from '../encaissement-dialog/encaissement-dialog.component';
import { EncaissementsDetailsDialogComponent, EncaissementsDetailsDialogData } from '../encaissements-details-dialog/encaissements-details-dialog.component';
import { ConfirmationService } from '@lhacksrt/services/confirmation/confirmation.service';

export interface QuittanceWithEncaissements extends QuittanceResponse {
  encaissements: EncaissementQuittanceResponse[];
  nombreEncaissements: number;
  montantEncaisse: number;
  soldeQuittance: number;
  statutEncaissement: 'NON_ENCAISSE' | 'PARTIEL' | 'ENCAISSE';
}

@Component({
  selector: 'app-quittance-list',
  templateUrl: './quittance-list.component.html',
  styleUrls: ['./quittance-list.component.scss']
})
export class QuittanceListComponent implements OnInit, OnDestroy {

  PERMISSIONS_DATA = PERMISSIONS;
  MANAGEMENT_ENTITY_TYPES = Object.values(ManagementEntityType);

  quittances: QuittanceWithEncaissements[] = [];
  filteredQuittances: QuittanceWithEncaissements[] = [];
  isLoading = false;
  hasError = false;

  entity?: ManagementEntity;
  companies: Company[] = [];
  selectedCompany: Company | null = null;

  // Filter options
  searchTerm = '';
  statusFilter: 'ALL' | 'NON_ENCAISSE' | 'PARTIEL' | 'ENCAISSE' = 'ALL';

  // Table columns
  displayedColumns = [
    'quittanceNumero',
    'montantQuittance',
    'dateSortQuittance',
    'nombreEncaissements',
    'montantEncaisse',
    'soldeQuittance',
    'statutEncaissement',
    'actions'
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private _layoutService: LayoutService,
    private _transloco: TranslocoService,
    private _userService: UserService,
    private _toastService: ToastService,
    private _companyService: CompanyService,
    private _encaissementService: EncaissementQuittanceService,
    private _accountingService: AccountingService,
    private _dialog: MatDialog,
    private _confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this._layoutService.setPageTitle(this._transloco.translate('layout.titles.quittanceList'));
    this._layoutService.setCrumbs([
      { title: this._transloco.translate('layout.crumbs.accounting'), link: '#', active: false },
      { title: this._transloco.translate('layout.crumbs.quittanceList'), link: '/accounting/quittances', active: true }
    ]);

    this._userService.managementEntity$
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: ManagementEntity | null) => {
        this.entity = entity || undefined;

        if (entity?.type === ManagementEntityType.MARKET_LEVEL_ORGANIZATION) {
          this.loadCompanies();
        } else {
          this.loadQuittances();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadQuittances(): void {
    if (!this.entity) return;

    if (this.entity.type === ManagementEntityType.MARKET_LEVEL_ORGANIZATION && !this.selectedCompany) {
      this._toastService.show('warn', 'Veuillez sélectionner une compagnie');
      return;
    }

    this.isLoading = true;
    this.hasError = false;

    // Get all quittances from the accounting service
    const id = this.entity.type === ManagementEntityType.MARKET_LEVEL_ORGANIZATION ? this.selectedCompany?.id : this.entity.id;
    this._accountingService.getAllQuittancesByCompany(id ?? "")
      .pipe(
        takeUntil(this.destroy$),
        switchMap(quittances => {
          if (quittances.length === 0) {
            return of([]);
          }

          // For each quittance, get its encaissements
          const quittanceWithEncaissementsObservables = quittances.map(quittance =>
            this._encaissementService.getByQuittance(quittance.uuid)
              .pipe(
                catchError(() => of([])),
                map(encaissements => {
                  const montantEncaisse = encaissements.reduce((sum, enc) => sum + enc.montant, 0);
                  const soldeQuittance = quittance.montant - montantEncaisse;

                  return {
                    ...quittance,
                    encaissements,
                    nombreEncaissements: encaissements.length,
                    montantEncaisse,
                    soldeQuittance,
                    statutEncaissement: this._encaissementService.getEncaissementStatus(quittance, encaissements)
                  } as QuittanceWithEncaissements;
                })
              )
          );

          return forkJoin(quittanceWithEncaissementsObservables);
        }),
        catchError(error => {
          console.error('Error loading quittances:', error);
          this.hasError = true;
          this._toastService.show('error', 'Erreur lors du chargement des quittances');
          return of([]);
        })
      )
      .subscribe({
        next: (quittancesWithEncaissements) => {
          this.quittances = quittancesWithEncaissements;
          this.applyFilters();
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
  }

  applyFilters(): void {
    let filtered = [...this.quittances];

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(q =>
        q.numero.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (this.statusFilter !== 'ALL') {
      filtered = filtered.filter(q => q.statutEncaissement === this.statusFilter);
    }

    this.filteredQuittances = filtered;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  openEncaissementDialog(quittance: QuittanceWithEncaissements, encaissement?: EncaissementQuittanceResponse): void {
    const data: EncaissementDialogData = {
      quittance,
      soldeQuittance: quittance.soldeQuittance,
      isEdit: !!encaissement,
      encaissement
    };

    const dialogRef = this._dialog.open(EncaissementDialogComponent, {
      width: '800px',
      maxWidth: '90vw',
      data,
      disableClose: true
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this._toastService.show('success', 'Encaissement traité avec succès');
          this.loadQuittances(); // Reload data
        }
      });
  }

  viewEncaissements(quittance: QuittanceWithEncaissements): void {
    const data: EncaissementsDetailsDialogData = {
      quittance
    };

    const dialogRef = this._dialog.open(EncaissementsDetailsDialogComponent, {
      width: '1000px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data,
      disableClose: false
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result?.action === 'edit') {
          this.openEncaissementDialog(quittance, result.encaissement);
        } else if (result?.action === 'delete') {
          this.deleteEncaissement(quittance, result.encaissement);
        }
      });
  }

  addEncaissement(quittance: QuittanceWithEncaissements): void {
    if (quittance.soldeQuittance <= 0) {
      this._toastService.show('warn', 'Cette quittance est déjà entièrement encaissée');
      return;
    }
    this.openEncaissementDialog(quittance);
  }

  editEncaissement(quittance: QuittanceWithEncaissements): void {
    if (quittance.encaissements.length !== 1) {
      this._toastService.show('warn', 'Modification disponible uniquement pour les encaissements uniques');
      return;
    }
    this.openEncaissementDialog(quittance, quittance.encaissements[0]);
  }

  deleteEncaissement(quittance: QuittanceWithEncaissements, encaissement: EncaissementQuittanceResponse): void {
    const confirmation = this._confirmationService.open({
      title: 'Supprimer l\'encaissement',
      message: `Êtes-vous sûr de vouloir supprimer l'encaissement ${encaissement.numero} ?`,
      actions: {
        confirm: {
          label: 'Supprimer',
          color: 'warn'
        },
        cancel: {
          label: 'Annuler'
        }
      }
    });

    confirmation.afterClosed()
      .pipe(
        takeUntil(this.destroy$),
        switchMap(result => {
          if (result === 'confirmed') {
            return this._encaissementService.delete(encaissement.uuid);
          }
          return [];
        })
      )
      .subscribe({
        next: () => {
          this._toastService.show('success', 'Encaissement supprimé avec succès');
          this.loadQuittances();
        },
        error: (error) => {
          console.error('Error deleting encaissement:', error);
          this._toastService.show('error', 'Erreur lors de la suppression');
        }
      });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'ENCAISSE': return 'bg-green-100 text-green-800';
      case 'PARTIEL': return 'bg-orange-100 text-orange-800';
      case 'NON_ENCAISSE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'ENCAISSE': return 'Encaissé';
      case 'PARTIEL': return 'Partiel';
      case 'NON_ENCAISSE': return 'Non encaissé';
      default: return status;
    }
  }

  loadCompanies(): void {
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

  selectCompany(company: Company): void {
    this.selectedCompany = company;
    this.quittances = [];
    this.filteredQuittances = [];
    this.hasError = false;
  }

  isMLA(): boolean {
    return this.entity?.type === ManagementEntityType.MARKET_LEVEL_ORGANIZATION;
  }

  getDisplayEntityName(): string {
    if (!this.entity) return '';

    if (this.entity.type === ManagementEntityType.MARKET_LEVEL_ORGANIZATION) {
      return this.selectedCompany?.name || 'Aucune compagnie sélectionnée';
    }

    return this.entity.name;
  }

  getTotalQuittanceAmount(): number {
    return this.filteredQuittances.reduce((total, q) => total + q.montant, 0);
  }

  getTotalEncashedAmount(): number {
    return this.filteredQuittances.reduce((total, q) => total + q.montantEncaisse, 0);
  }

  getTotalBalance(): number {
    return this.filteredQuittances.reduce((total, q) => total + q.soldeQuittance, 0);
  }
}
