import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { UsersService } from '../../users.service';
import { Employee } from '@core/services/employee/employee.inteface';
import { EmployeeRequest, ManagementEntityType, ProfileResponse } from '../../dto';
import { PERMISSIONS } from '@core/permissions/permissions.data';
import { PermissionsService } from '@core/permissions/permissions.service';
import { UserService } from '@core/services/user/user.service';
import { LayoutService } from '@lhacksrt/services/layout/layout.service';
import { TranslocoPipe } from '@jsverse/transloco';

// Management Entity interface
interface ManagementEntity {
  id: string;
  name: string;
}

@Component({
  selector: 'app-employees-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslocoPipe],
  templateUrl: "./list.component.html"
})
export class UsersListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  availableProfiles: ProfileResponse[] = [];
  availableManagementEntities: ManagementEntity[] = [];
  
  searchTerm: string = '';
  statusFilter: string = '';
  
  showModal: boolean = false;
  isEditMode: boolean = false;
  isViewMode: boolean = false;
  selectedEmployee: Employee | null = null;

  employeeData: EmployeeRequest = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    accessLevel: '',
    managementEntity: '',
    profiles: [],
  };

  features = {
    create: false,
    update: false,
    delete: false,
    view: false,
    grant: false,
    revoke: false,
  }

  levelValues = Object.values(ManagementEntityType);

  // Modal mode enum for better type safety
  get modalTitle(): string {
    if (this.isViewMode) return 'employees.modal.view';
    if (this.isEditMode) return 'employees.modal.edit';
    return 'employees.modal.create';
  }

  constructor(private usersService: UsersService,
    private _layoutService: LayoutService,
    private _userService: UserService,
    private _permissionService: PermissionsService) { }

  ngOnInit() {
    this.loadEmployees();
    this.loadProfiles();
    this.loadManagementEntities();

    this._userService.user$.pipe(takeUntil(this.destroy$)).subscribe({
            next: (user) => {
              this.features = {
                create: this._permissionService.hasPermission(user, [PERMISSIONS.ALL, PERMISSIONS.CREATE_EMPLOYEE]),
                update: this._permissionService.hasPermission(user, [PERMISSIONS.ALL, PERMISSIONS.UPDATE_EMPLOYEE]),
                delete: this._permissionService.hasPermission(user, [PERMISSIONS.ALL, PERMISSIONS.DELETE_EMPLOYEE]),
                view: this._permissionService.hasPermission(user, [PERMISSIONS.ALL, PERMISSIONS.READ_EMPLOYEE]),
                grant: this._permissionService.hasPermission(user, [PERMISSIONS.ALL, PERMISSIONS.GRANT_PROFILE]),
                revoke: this._permissionService.hasPermission(user, [PERMISSIONS.ALL, PERMISSIONS.REVOKE_PROFILE])
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

  loadEmployees() {
    this.usersService.getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (employees) => {
          this.employees = employees;
          this.filteredEmployees = employees;
        },
        error: (error) => {
          console.error('Error loading employees:', error);
          // Handle error appropriately
        }
      });
  }

  loadProfiles() {
    this.usersService.getAllProfiles()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (profiles) => {
          this.availableProfiles = profiles;
        },
        error: (error) => {
          console.error('Error loading profiles:', error);
        }
      });
  }

  loadManagementEntities() {
    // Assuming you have a method to get management entities
    // If not, you can mock this or create the method in your service
    this.usersService.getAllCompanies()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (companies) => {
          this.availableManagementEntities = companies;
        },
        error: (error) => {
          console.error('Error loading management entities:', error);
        }
      });
  }

  onSearch() {
    this.applyFilters();
  }

  onFilterChange() {
    this.applyFilters();
  }

  applyFilters() {
    let filtered = this.employees;

    // Apply search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(employee =>
        employee.lastName.toLowerCase().includes(term) ||
        employee.firstName.toLowerCase().includes(term) ||
        employee.email.toLowerCase().includes(term) ||
        (employee.accessLevel && employee.accessLevel.toLowerCase().includes(term))
      );
    }

    // Apply status filter
    if (this.statusFilter) {
      filtered = filtered.filter(employee => {
        if (this.statusFilter === 'active') return employee.accountNonLocked;
        if (this.statusFilter === 'inactive') return !employee.accountNonLocked;
        return true;
      });
    }

    this.filteredEmployees = filtered;
  }

  resetFilters() {
    this.searchTerm = '';
    this.statusFilter = '';
    this.filteredEmployees = this.employees;
  }

  openCreateModal() {
    this.isEditMode = false;
    this.isViewMode = false;
    this.selectedEmployee = null;
    this.resetEmployeeData();
    this.showModal = true;
  }

  editEmployee(employee: Employee) {
    this.isEditMode = true;
    this.isViewMode = false;
    this.selectedEmployee = employee;
    this.employeeData = {
      firstname: employee.firstName,
      lastname: employee.lastName,
      email: employee.email,
      password: '', // Don't populate password for security
      accessLevel: employee.accessLevel || '',
      managementEntity: employee.managementEntity?.uuid || '',
      profiles: employee.profiles?.map(p => p.id) || [],
    };
    this.showModal = true;
  }

  viewEmployee(employee: Employee) {
    this.isEditMode = false;
    this.isViewMode = true;
    this.selectedEmployee = employee;
    this.employeeData = {
      firstname: employee.firstName,
      lastname: employee.lastName,
      email: employee.email,
      password: '',
      accessLevel: employee.accessLevel || '',
      managementEntity: employee.managementEntity?.uuid || '',
      profiles: employee.profiles?.map(p => p.id) || [],
    };
    this.showModal = true;
  }

  activateEmployee(employee: Employee) {
    this.usersService.activateUser(employee.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadEmployees();
        },
        error: (error) => {
          console.error('Error activating employee:', error);
        }
      });
  }

  deactivateEmployee(employee: Employee) {
    if (confirm(`Are you sure you want to deactivate ${employee.firstName} ${employee.lastName}?`)) {
      this.usersService.deactivateUser(employee.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadEmployees();
          },
          error: (error) => {
            console.error('Error deactivating employee:', error);
          }
        });
    }
  }

  deleteEmployee(employee: Employee) {
    if (confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}? This action cannot be undone.`)) {
      this.usersService.deleteUser(employee.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadEmployees();
          },
          error: (error) => {
            console.error('Error deleting employee:', error);
          }
        });
    }
  }

  closeModal() {
    this.showModal = false;
    this.isEditMode = false;
    this.isViewMode = false;
    this.selectedEmployee = null;
    this.resetEmployeeData();
  }

  onSubmit() {
    if (this.isViewMode) {
      this.closeModal();
      return;
    }

    // Prepare data for submission
    const submitData: EmployeeRequest = {
      firstname: this.employeeData.firstname,
      lastname: this.employeeData.lastname,
      email: this.employeeData.email,
      password: this.employeeData.password,
      accessLevel: this.employeeData.accessLevel,
      managementEntity: this.employeeData.managementEntity,
      profiles: this.employeeData.profiles || []
    };

    if (this.isEditMode && this.selectedEmployee) {
      const { password, ...data } = submitData;
      this.usersService.updateUser(this.selectedEmployee.id, data)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadEmployees();
            this.closeModal();
          },
          error: (error) => {
            console.error('Error updating employee:', error);
          }
        });
    } else {
      console.log('Creating new employee:', submitData);
      this.usersService.createUser(submitData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadEmployees();
            this.closeModal();
          },
          error: (error) => {
            console.error('Error creating employee:', error);
          }
        });
    }
  }

  resetEmployeeData() {
    this.employeeData = {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      accessLevel: '',
      managementEntity: '',
      profiles: [],
    };
  }

  isProfileSelected(profileId: string): boolean {
    return this.employeeData.profiles?.includes(profileId) || false;
  }

  onProfileChange(profileId: string, event: any) {
    if (this.isViewMode) return; // Don't allow changes in view mode

    if (!this.employeeData.profiles) {
      this.employeeData.profiles = [];
    }

    if (event.target.checked) {
      this.employeeData.profiles.push(profileId);
    } else {
      this.employeeData.profiles = this.employeeData.profiles.filter(id => id !== profileId);
    }
  }

  getEmployeeInitials(firstname: string, lastname: string): string {
    return (firstname.charAt(0) + lastname.charAt(0)).toUpperCase();
  }

  getManagementEntityName(entityId: string): string {
    const entity = this.availableManagementEntities.find(e => e.id === entityId);
    return entity ? entity.name : 'Unknown';
  }

  trackByEmployee(index: number, employee: Employee): string {
    return employee.id;
  }
}