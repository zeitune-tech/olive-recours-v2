import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { UsersService } from '../../users.service';
import { Company } from '@core/services/company/company.interface';
import { CompanyRequest } from '../../dto';

@Component({
  selector: 'app-companies-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    acronym: ''
  };

  constructor(private usersService: UsersService) {}

  ngOnInit() {
    this.loadCompanies();
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
      (company.acronym && company.acronym.toLowerCase().includes(term))
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
      acronym: company.acronym || ''
    };
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
      acronym: ''
    };
  }

  getCompanyInitials(name: string): string {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  }

  trackByCompany(index: number, company: Company): string {
    return company.id;
  }
}