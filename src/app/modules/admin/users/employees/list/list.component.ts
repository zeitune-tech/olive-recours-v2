import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { UsersService } from '../../users.service';
import { Employee } from '@core/services/employee/employee.inteface';
import { EmployeeRequest, ProfileResponse } from '../../dto';

@Component({
  selector: 'app-employees-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./list.component.html"
})

export class UsersListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  availableProfiles: ProfileResponse[] = [];
  searchTerm: string = '';
  statusFilter: string = '';
  showModal: boolean = false;
  isEditMode: boolean = false;
  selectedEmployee: Employee | null = null;

  employeeData: EmployeeRequest = {
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    address: '',
    managementEntityId: '',
    profiles: []
  };

  constructor(private usersService: UsersService) { }

  ngOnInit() {
    this.loadEmployees();
    this.loadProfiles();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadEmployees() {
    this.usersService.getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(employees => {
        this.employees = employees;
        this.filteredEmployees = employees;
      });
  }

  loadProfiles() {
    this.usersService.getAllProfiles()
      .pipe(takeUntil(this.destroy$))
      .subscribe(profiles => {
        this.availableProfiles = profiles;
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
        (employee.phone && employee.phone.toLowerCase().includes(term))
      );
    }

    // Apply status filter
    if (this.statusFilter) {
      filtered = filtered.filter(employee => {
        if (this.statusFilter === 'active') return employee.isActive;
        if (this.statusFilter === 'inactive') return !employee.isActive;
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
    this.selectedEmployee = null;
    this.resetEmployeeData();
    this.showModal = true;
  }

  editEmployee(employee: Employee) {
    this.isEditMode = true;
    this.selectedEmployee = employee;
    this.employeeData = {
      firstname: employee.firstName,
      lastname: employee.lastName,
      email: employee.email,
      phone: employee.phone || '',
      address: employee.birthDate || '',
      managementEntityId: employee.managementEntity.id,
      profiles: employee.profiles?.map(p => p.id) || []
    };
    this.showModal = true;
  }

  viewEmployee(employee: Employee) {
    // TODO: Implement view employee functionality
  }

  activateEmployee(employee: Employee) {
    // TODO: Implement activate functionality
    // this.usersService.activateUser(employee.id).subscribe(() => {
    //   this.loadEmployees();
    // });
  }

  deactivateEmployee(employee: Employee) {
    if (confirm(`Are you sure you want to deactivate ${employee.firstName} ${employee.lastName}?`)) {
      // TODO: Implement deactivate functionality
      // this.usersService.deactivateUser(employee.id).subscribe(() => {
      //   this.loadEmployees();
      // });
    }
  }

  deleteEmployee(employee: Employee) {
    if (confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
      // TODO: Implement delete functionality
      // this.usersService.deleteUser(employee.id).subscribe(() => {
      //   this.loadEmployees();
      // });
    }
  }

  closeModal() {
    this.showModal = false;
    this.resetEmployeeData();
  }

  onSubmit() {
    if (this.isEditMode && this.selectedEmployee) {
      // TODO: Implement update functionality
      // this.usersService.updateUser(this.selectedEmployee.id, this.employeeData)
      //   .subscribe(() => {
      //     this.loadEmployees();
      //     this.closeModal();
      //   });
    } else {
      // TODO: Implement create functionality
      // this.usersService.createUser(this.employeeData)
      //   .subscribe(() => {
      //     this.loadEmployees();
      //     this.closeModal();
      //   });
    }
  }

  resetEmployeeData() {
    this.employeeData = {
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      address: '',
      managementEntityId: '',
      profiles: []
    };
  }

  isProfileSelected(profileId: string): boolean {
    return this.employeeData.profiles?.includes(profileId) || false;
  }

  onProfileChange(profileId: string, event: any) {
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

  trackByEmployee(index: number, employee: Employee): string {
    return employee.id;
  }
}