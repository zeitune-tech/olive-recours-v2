import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { PermissionsService } from '@core/permissions/permissions.service';
import { UserService } from '@core/services/user/user.service';
import { LayoutService } from '@lhacksrt/services/layout/layout.service';
import { PERMISSIONS } from '@core/permissions/permissions.data';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { MarketLevelOrganizationService } from './market-level-organization.service';
import { MarketLevelOrganisationRequest, MarketLevelOrganizationResponse } from '../dto';

@Component({
  selector: 'app-organization',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslocoPipe],
  templateUrl: './organization.component.html',
})
export class OrganizationComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  organizations: MarketLevelOrganizationResponse[] = [];
  filteredOrganizations: MarketLevelOrganizationResponse[] = [];
  searchTerm: string = '';
  showModal: boolean = false;
  isEditMode: boolean = false;
  selectedOrganization: MarketLevelOrganizationResponse | null = null;
  loading: boolean = false;
  
  organizationData: MarketLevelOrganisationRequest = {
    name: '',
    email: '',
    phone: '',
    address: '',
    fax: '',
    gsm: '',
    acronym: '',
    dateOfCreation: ''
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

  constructor(private organizationService: MarketLevelOrganizationService,
    private _layoutService: LayoutService,
    private transloco: TranslocoService,
    private _userService: UserService,
    private _permissionService: PermissionsService,
    private _changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {

    this._layoutService.setPageTitle(this.transloco.translate('layout.titles.organizations'));
    this._layoutService.setCrumbs([
      { title: this.transloco.translate('layout.crumbs.organizations'), link: '/admin/users/organization', active: true }
    ]);

    this.loadOrganizations();

    this._userService.user$.pipe(takeUntil(this.destroy$)).subscribe({
            next: (user) => {
              this.features = {
                create: this._permissionService.hasPermission(user, [PERMISSIONS.ALL, PERMISSIONS.CREATE_MLO]),
                update: this._permissionService.hasPermission(user, [PERMISSIONS.ALL, PERMISSIONS.UPDATE_MLO]),
                delete: this._permissionService.hasPermission(user, [PERMISSIONS.ALL, PERMISSIONS.DELETE_MLO])
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

  loadOrganizations() {
    this.organizationService.getAllOrganizations()
      .pipe(takeUntil(this.destroy$))
      .subscribe(organizations => {
        this.organizations = organizations;
        this.filteredOrganizations = organizations;
      });
  }

  onSearch() {
    if (!this.searchTerm.trim()) {
      this.filteredOrganizations = this.organizations;
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredOrganizations = this.organizations.filter(organization =>
      organization.name.toLowerCase().includes(term) ||
      organization.email.toLowerCase().includes(term) ||
      organization.phone.toLowerCase().includes(term) ||
      organization.address.toLowerCase().includes(term) ||
      (organization.acronym && organization.acronym.toLowerCase().includes(term))
    );
  }

  resetFilters() {
    this.searchTerm = '';
    this.filteredOrganizations = this.organizations;
  }

  openCreateModal() {
    this.isEditMode = false;
    this.selectedOrganization = null;
    this.resetOrganizationData();
    this.showModal = true;
  }

  editOrganization(organization: MarketLevelOrganizationResponse) {
    this.isEditMode = true;
    this.selectedOrganization = organization;
    this.organizationData = {
      name: organization.name,
      email: organization.email,
      phone: organization.phone,
      address: organization.address,
      fax: organization.fax || '',
      gsm: organization.gsm || '',
      acronym: organization.acronym || '',
      dateOfCreation: organization.dateOfCreation || ''
    };
    this.selectedLogo = organization.logo || null;
    this.selectedLogoFile = null;
    this.logoUploadError = '';
    this.showModal = true;
  }

  deleteOrganization(organization: MarketLevelOrganizationResponse) {
    if (confirm(`Are you sure you want to delete ${organization.name}?`)) {
      this.loading = true;
      this.organizationService.deleteOrganization(organization.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadOrganizations();
          },
          error: (error) => {
            console.error('Error deleting organization:', error);
            this.loading = false;
          }
        });
    }
  }

  closeModal() {
    this.showModal = false;
    this.resetOrganizationData();
  }

  onSubmit() {
    if (this.isEditMode && this.selectedOrganization) {
      this.loading = true;
      this.organizationService.updateOrganization(this.selectedOrganization.id, this.organizationData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadOrganizations();
            this.closeModal();
          },
          error: (error) => {
            console.error('Error updating organization:', error);
            this.loading = false;
          }
        });
    } else {
      this.loading = true;
      this.organizationService.createOrganization(this.organizationData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadOrganizations();
            this.closeModal();
          },
          error: (error) => {
            console.error('Error creating organization:', error);
            this.loading = false;
          }
        });
    }
  }

  resetOrganizationData() {
    this.organizationData = {
      name: '',
      email: '',
      phone: '',
      address: '',
      fax: '',
      gsm: '',
      acronym: '',
      dateOfCreation: ''
    };
  }

  getOrganizationInitials(name: string): string {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  }

  trackByOrganization(index: number, organization: MarketLevelOrganizationResponse): string {
    return organization.id;
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
    if (this.selectedOrganization && this.selectedLogoFile) {
      this.loadingLogo = true;
      this.logoUploadError = '';
      this.organizationService.uploadOrganizationLogo(this.selectedOrganization.id, this.selectedLogoFile).subscribe({
        next: () => {
          // this.loadOrganizations();
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
    this.selectedLogo = this.selectedOrganization?.logo || null;
    this.selectedLogoFile = null;
    this.logoUploadError = '';
    this._changeDetectorRef.markForCheck();
  }

}