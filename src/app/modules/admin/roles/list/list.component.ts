import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RolesService } from '../roles.service';
import { ProfileResponse, PermissionResponse, ProfileRequest, ManagementEntityType } from '../../users/dto';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { LayoutService } from '@lhacksrt/services/layout/layout.service';
import { UserService } from '@core/services/user/user.service';
import { PermissionsService } from '@core/permissions/permissions.service';
import { PERMISSIONS } from '@core/permissions/permissions.data';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatSelectModule, TranslocoPipe],
  templateUrl: './list.component.html',
})
export class RolesListComponent implements OnInit, OnDestroy {
  profiles: ProfileResponse[] = [];
  permissions: PermissionResponse[] = [];
  filteredProfiles: ProfileResponse[] = [];
  searchTerm: string = '';
  loading: boolean = false;
  showModal: boolean = false;
  isEditMode: boolean = false;
  selectedProfile: ProfileResponse | null = null;
  levelValues = Object.values(ManagementEntityType);

  roleData: ProfileRequest = {
    name: '',
    description: '',
    level: ManagementEntityType.COMPANY,
    permissions: []
  };

  features = {
    create: false,
    update: false,
    delete: false,
  }



  private destroy$ = new Subject<void>();

  constructor(private rolesService: RolesService,
    private _layoutService: LayoutService,
    private transloco: TranslocoService,
    private _userService: UserService,
    private _permissionService: PermissionsService) { }

  enumToText(enumValue: string): string {
    switch (enumValue) {
      case ManagementEntityType.COMPANY:
        return 'Compagnie';
      case ManagementEntityType.MARKET_LEVEL_ORGANIZATION:
        return 'Organisation de niveau marché';
      default:
        return enumValue;
    }
  }

  ngOnInit(): void {
    this._layoutService.setPageTitle(this.transloco.translate('layout.titles.roles'));
    this._layoutService.setCrumbs([
      { title: this.transloco.translate('layout.crumbs.roles'), link: '/admin/roles', active: true }
    ]);
    this.loadData();
    this.setupSubscriptions();

    console.log(this.roleData.permissions);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  LevelEnumToText(enumValue: string): string {
    switch (enumValue) {
      case ManagementEntityType.COMPANY:
        return 'roles.level.company';
      case ManagementEntityType.MARKET_LEVEL_ORGANIZATION:
        return 'roles.level.market_level_organization';
      default:
        return enumValue;
    }
  }

  private setupSubscriptions(): void {
    this.rolesService.profiles$
      .pipe(takeUntil(this.destroy$))
      .subscribe(profiles => {
        this.profiles = profiles;
        this.filterRoles();
      });

    this.rolesService.permissions$
      .pipe(takeUntil(this.destroy$))
      .subscribe(permissions => {
        this.permissions = permissions;
      });
  }

  private loadData(): void {
    this.loading = true;

    this.rolesService.getAllProfiles()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading profiles:', error);
          this.loading = false;
        }
      });

    this.rolesService.getAllPermissions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: (error) => {
          console.error('Error loading permissions:', error);
        }
      });

    this._userService.user$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (user) => {
        this.features = {
          create: this._permissionService.hasPermission(user, [PERMISSIONS.ALL, PERMISSIONS.CREATE_PROFILE]),
          update: this._permissionService.hasPermission(user, [PERMISSIONS.ALL, PERMISSIONS.UPDATE_PROFILE]),
          delete: this._permissionService.hasPermission(user, [PERMISSIONS.ALL, PERMISSIONS.DELETE_PROFILE])
        }
      },
      error: (error) => {
        console.error('Error loading permissions:', error);
      }
    });
  }

  filterRoles(): void {
    if (!this.searchTerm.trim()) {
      this.filteredProfiles = [...this.profiles];
      return;
    }

    const searchTerm = this.searchTerm.toLowerCase();
    this.filteredProfiles = this.profiles.filter(profile =>
      profile.name.toLowerCase().includes(searchTerm) ||
      profile.description?.toLowerCase().includes(searchTerm) ||
      profile.permissions.some(permission =>
        permission.name.toLowerCase().includes(searchTerm)
      )
    );
  }

  refreshRoles(): void {
    this.loadData();
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedProfile = null;
    this.resetRoleData();
    this.showModal = true;
  }

  editRole(profile: ProfileResponse): void {
    this.isEditMode = true;
    this.selectedProfile = profile;
    this.roleData = {
      name: profile.name,
      description: profile.description || '',
      level: profile.level,
      permissions: profile.permissions.map(p => p.id)
    };

    this.showModal = true;
  }


  deleteRole(profile: ProfileResponse): void {
    if (confirm(`Are you sure you want to delete the role "${profile.name}"?`)) {
      this.loading = true;
      this.rolesService.deleteProfile(profile.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadData();
          },
          error: (error) => {
            console.error('Error deleting role:', error);
            this.loading = false;
          }
        });
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.resetRoleData();
  }

  onSubmit(): void {
    const payload: ProfileRequest = {
      ...this.roleData,
    };


    if (this.isEditMode && this.selectedProfile) {
      this.loading = true;
      this.rolesService.updateProfile(this.selectedProfile.id, payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadData();
            this.closeModal();
          },
          error: (error) => {
            console.error('Error updating role:', error);
            this.loading = false;
          }
        });
    } else {
      this.loading = true;
      this.rolesService.createProfile(payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadData();
            this.closeModal();
          },
          error: (error) => {
            console.error('Error creating role:', error);
            this.loading = false;
          }
        });
    }
  }

  resetRoleData(): void {
    this.roleData = {
      name: '',
      description: '',
      level: '',
      permissions: []
    };
  }

  getInitials(name: string): string {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  }

  trackByProfileId(index: number, profile: ProfileResponse): string {
    return profile.id;
  }

  trackByPermissionId(index: number, permission: PermissionResponse): string {
    return permission.id;
  }

  onPermissionToggle(permissionId: string, checked: boolean): void {
    if (checked) {
      if (!this.roleData.permissions.includes(permissionId)) {
        this.roleData.permissions.push(permissionId);
      }
    } else {
      this.roleData.permissions = this.roleData.permissions.filter(id => id !== permissionId);
    }
  }

  onPermissionCheckboxChange(event: Event, permissionId: string): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.onPermissionToggle(permissionId, checked);
  }
}