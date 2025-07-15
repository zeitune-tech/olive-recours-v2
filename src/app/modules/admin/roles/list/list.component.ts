import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RolesService } from '../roles.service';
import { ProfileResponse, PermissionResponse } from '../../users/dto';

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './list.component.html',
})
export class RolesListComponent implements OnInit, OnDestroy {
  profiles: ProfileResponse[] = [];
  permissions: PermissionResponse[] = [];
  filteredProfiles: ProfileResponse[] = [];
  searchTerm: string = '';
  loading: boolean = false;
  
  private destroy$ = new Subject<void>();

  constructor(private rolesService: RolesService) {}

  ngOnInit(): void {
    this.loadData();
    this.setupSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSubscriptions(): void {
    // Subscribe to profiles changes
    this.rolesService.profiles$
      .pipe(takeUntil(this.destroy$))
      .subscribe(profiles => {
        this.profiles = profiles;
        this.filterRoles();
      });

    // Subscribe to permissions changes
    this.rolesService.permissions$
      .pipe(takeUntil(this.destroy$))
      .subscribe(permissions => {
        this.permissions = permissions;
      });
  }

  private loadData(): void {
    this.loading = true;
    
    // Load both profiles and permissions
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

  createNewRole(): void {
    // Navigate to create role page or open modal
    console.log('Create new role');
  }

  viewRole(profile: ProfileResponse): void {
    // Navigate to view role page or open modal
    console.log('View role:', profile);
  }

  editRole(profile: ProfileResponse): void {
    // Navigate to edit role page or open modal
    console.log('Edit role:', profile);
  }

  deleteRole(profile: ProfileResponse): void {
    if (confirm(`Are you sure you want to delete the role "${profile.name}"?`)) {
      this.rolesService.deleteProfile(profile.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            console.log('Role deleted successfully');
          },
          error: (error) => {
            console.error('Error deleting role:', error);
          }
        });
    }
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
}