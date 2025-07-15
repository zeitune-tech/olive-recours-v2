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

  viewCompany(company: Company) {
    // TODO: Implement view company functionality
  }

  deleteCompany(company: Company) {
    if (confirm(`Are you sure you want to delete ${company.name}?`)) {
      // TODO: Implement delete functionality
      // this.usersService.deleteCompany(company.id).subscribe(() => {
      //   this.loadCompanies();
      // });
    }
  }

  closeModal() {
    this.showModal = false;
    this.resetCompanyData();
  }

  onSubmit() {
    if (this.isEditMode && this.selectedCompany) {
      // TODO: Implement update functionality
      // this.usersService.updateCompany(this.selectedCompany.id, this.companyData)
      //   .subscribe(() => {
      //     this.loadCompanies();
      //     this.closeModal();
      //   });
    } else {
      // TODO: Implement create functionality
      // this.usersService.createCompany(this.companyData)
      //   .subscribe(() => {
      //     this.loadCompanies();
      //     this.closeModal();
      //   });
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