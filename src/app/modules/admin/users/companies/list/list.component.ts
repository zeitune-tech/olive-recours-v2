import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { UsersService } from '../../users.service';
import { Company } from '@core/services/company/company.interface';
import { CompanyRequest } from '../../dto';
import { PermissionsService } from '@core/permissions/permissions.service';
import { UserService } from '@core/services/user/user.service';
import { LayoutService } from '@lhacksrt/services/layout/layout.service';
import { PERMISSIONS } from '@core/permissions/permissions.data';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { MarketLevelOrganizationService } from '../../market-level-organization.service';
import { MarketLevelOrganizationResponse } from '../../dto';

@Component({
  selector: 'app-companies-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslocoPipe],
  templateUrl: './list.component.html',
})
export class CompaniesListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  companies: Company[] = [];
  filteredCompanies: Company[] = [];
  searchTerm: string = '';
  showModal: boolean = false;
  isEditMode: boolean = false;
  selectedCompany: Company | null = null;
  loading: boolean = false;
  
  companyData: CompanyRequest = {
    name: '',
    email: '',
    phone: '',
    address: '',
    fax: '',
    gsm: '',
    acronym: '',
    dateOfCreation: '',
    supervisorUuid: ''
  };

  features = {
    create: false,
    update: false,
    delete: false,
  }

  selectedLogo: string | null = null;
  selectedLogoFile: File | null = null;
  loadingLogo: boolean = false;
  logoUploadError: string = '';

  organizations: MarketLevelOrganizationResponse[] = [];

  constructor(private usersService: UsersService,
    private _layoutService: LayoutService,
    private transloco: TranslocoService,
    private _userService: UserService,
    private _permissionService: PermissionsService,
    private _changeDetectorRef: ChangeDetectorRef,
    private marketLevelOrganizationService: MarketLevelOrganizationService) { }

  ngOnInit() {

    this._layoutService.setPageTitle(this.transloco.translate('layout.titles.companies'));
    this._layoutService.setCrumbs([
      { title: this.transloco.translate('layout.crumbs.companies'), link: '/admin/users/companies', active: true }
    ]);

    this.loadCompanies();
    this.loadOrganizations();

    this._userService.user$.pipe(takeUntil(this.destroy$)).subscribe({
            next: (user) => {
              this.features = {
                create: this._permissionService.hasPermission(user, [PERMISSIONS.ALL, PERMISSIONS.CREATE_COMPANY]),
                update: this._permissionService.hasPermission(user, [PERMISSIONS.ALL, PERMISSIONS.UPDATE_COMPANY]),
                delete: this._permissionService.hasPermission(user, [PERMISSIONS.ALL, PERMISSIONS.DELETE_COMPANY])
              }
            },
            error: (error) => {
              console.error('Error loading permissions:', error);
            }
          });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCompanies() {
    this.usersService.getAllCompanies()
      .pipe(takeUntil(this.destroy$))
      .subscribe(companies => {
        this.companies = companies;
        this.filteredCompanies = companies;
      });
  }

  loadOrganizations() {
    this.marketLevelOrganizationService.getAllOrganizations()
      .pipe(takeUntil(this.destroy$))
      .subscribe(organizations => {
        this.organizations = organizations;
      });
  }

  onSearch() {
    if (!this.searchTerm.trim()) {
      this.filteredCompanies = this.companies;
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredCompanies = this.companies.filter(company =>
      company.name.toLowerCase().includes(term) ||
      company.email.toLowerCase().includes(term) ||
      company.phone.toLowerCase().includes(term) ||
      company.address.toLowerCase().includes(term) ||
      (company.acronym && company.acronym.toLowerCase().includes(term)) ||
      (company.supervisor && company.supervisor.name.toLowerCase().includes(term))
    );
  }

  resetFilters() {
    this.searchTerm = '';
    this.filteredCompanies = this.companies;
  }

  openCreateModal() {
    this.isEditMode = false;
    this.selectedCompany = null;
    this.resetCompanyData();
    this.showModal = true;
  }

  editCompany(company: Company) {
    this.isEditMode = true;
    this.selectedCompany = company;
    this.companyData = {
      name: company.name,
      email: company.email,
      phone: company.phone,
      address: company.address,
      fax: company.fax || '',
      gsm: company.gsm || '',
      acronym: company.acronym || '',
      dateOfCreation: company.dateOfCreation || '',
      supervisorUuid: company.supervisor?.uuid || ''
    };
    this.selectedLogo = company.logo || null;
    this.selectedLogoFile = null;
    this.logoUploadError = '';
    this.showModal = true;
  }

  deleteCompany(company: Company) {
    if (confirm(`Are you sure you want to delete ${company.name}?`)) {
      this.loading = true;
      this.usersService.deleteCompany(company.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadCompanies();
          },
          error: (error) => {
            console.error('Error deleting company:', error);
            this.loading = false;
          }
        });
    }
  }

  closeModal() {
    this.showModal = false;
    this.resetCompanyData();
  }

  onSubmit() {
    if (!this.companyData.supervisorUuid) {
      return;
    }
    if (this.isEditMode && this.selectedCompany) {
      this.loading = true;
      this.usersService.updateCompany(this.selectedCompany.id, this.companyData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadCompanies();
            this.closeModal();
          },
          error: (error) => {
            console.error('Error updating company:', error);
            this.loading = false;
          }
        });
    } else {
      this.loading = true;
      this.usersService.createCompany(this.companyData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadCompanies();
            this.closeModal();
          },
          error: (error) => {
            console.error('Error creating company:', error);
            this.loading = false;
          }
        });
    }
  }

  resetCompanyData() {
    this.companyData = {
      name: '',
      email: '',
      phone: '',
      address: '',
      fax: '',
      gsm: '',
      acronym: '',
      dateOfCreation: '',
      supervisorUuid: ''
    };
  }

  getCompanyInitials(name: string): string {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  }

  getSupervisorName(supervisorId: string): string {
    if (!supervisorId) return '';
    const supervisor = this.organizations.find(org => org.id === supervisorId);
    return supervisor ? supervisor.name : '';
  }

  trackByCompany(index: number, company: Company): string {
    return company.id;
  }

  onLogoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      this.selectedLogoFile = input.files[0];
      reader.onload = (e) => {
        this.selectedLogo = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedLogoFile);
    }
  }

  validateLogo() {
    if (this.selectedCompany && this.selectedLogoFile) {
      this.loadingLogo = true;
      this.logoUploadError = '';
      this.usersService.uploadCompanyLogo(this.selectedCompany.id, this.selectedLogoFile).subscribe({
        next: () => {
          // this.loadCompanies();
          this._changeDetectorRef.markForCheck();
          this.selectedLogoFile = null;
          this.logoUploadError = '';
        },
        error: (err) => {
          this.logoUploadError = err.error?.message || 'Erreur lors de l\'upload du logo.';
        },
        complete: () => {
          this.loadingLogo = false;
        }
      });
    }
  }

  rejectLogo() {
    this.selectedLogo = this.selectedCompany?.logo || null;
    this.selectedLogoFile = null;
    this.logoUploadError = '';
    this._changeDetectorRef.markForCheck();
  }

}