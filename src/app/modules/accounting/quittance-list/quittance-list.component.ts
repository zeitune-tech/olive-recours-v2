import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
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
  QuittanceResponse, 
  EncaissementQuittanceResponse 
} from '../encaissement-quittance.service';
import { EncaissementDialogComponent, EncaissementDialogData } from '../encaissement-dialog/encaissement-dialog.component';
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

    // Mock data for now - in real implementation, you'd get quittances from an API
    // and then load encaissements for each quittance
    this.loadMockQuittancesWithEncaissements();
  }

  private loadMockQuittancesWithEncaissements(): void {
    // This is mock data - replace with actual API calls
    const mockQuittances: QuittanceResponse[] = [
      {
        uuid: 'q1',
        numero: 'Q001/2024',
        montant: 500000,
        nature: 'ENCAISSEMENT',
        dateSortQuittance: '2024-01-15T10:00:00Z'
      },
      {
        uuid: 'q2',
        numero: 'Q002/2024',
        montant: 750000,
        nature: 'ENCAISSEMENT',
        dateSortQuittance: '2024-01-20T14:30:00Z'
      },
      {
        uuid: 'q3',
        numero: 'Q003/2024',
        montant: 300000,
        nature: 'REGLEMENT',
        dateSortQuittance: '2024-01-25T09:15:00Z'
      }
    ];

    // For each quittance, load its encaissements
    const quittancesWithEncaissements: QuittanceWithEncaissements[] = mockQuittances.map(quittance => {
      // Mock encaissements data
      const mockEncaissements: EncaissementQuittanceResponse[] = [];
      
      // Add some mock encaissements for demonstration
      if (quittance.uuid === 'q1') {
        mockEncaissements.push({
          uuid: 'e1',
          numero: 'ENC001',
          quittance,
          montant: 200000,
          date: '2024-01-16T10:00:00Z'
        });
      } else if (quittance.uuid === 'q2') {
        mockEncaissements.push(
          {
            uuid: 'e2',
            numero: 'ENC002',
            quittance,
            montant: 300000,
            date: '2024-01-21T10:00:00Z'
          },
          {
            uuid: 'e3',
            numero: 'ENC003',
            quittance,
            montant: 450000,
            date: '2024-01-22T15:00:00Z'
          }
        );
      }

      const montantEncaisse = mockEncaissements.reduce((sum, enc) => sum + enc.montant, 0);
      const soldeQuittance = quittance.montant - montantEncaisse;
      
      return {
        ...quittance,
        encaissements: mockEncaissements,
        nombreEncaissements: mockEncaissements.length,
        montantEncaisse,
        soldeQuittance,
        statutEncaissement: this._encaissementService.getEncaissementStatus(quittance, mockEncaissements)
      };
    });

    this.quittances = quittancesWithEncaissements;
    this.applyFilters();
    this.isLoading = false;
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
    // Open a dialog or navigate to detailed view of encaissements
    this._toastService.show('info', `Affichage des ${quittance.nombreEncaissements} encaissements pour la quittance ${quittance.numero}`);
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