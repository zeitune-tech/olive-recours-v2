import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Company } from '@core/services/company/company.interface';
import { environment } from '@env/environment';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { Employee } from '@core/services/employee/employee.inteface';
import { CompanyRequest, EmployeeRequest, ProfileResponse } from './dto';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private readonly base_url = environment.base_url;
  private readonly request_url = environment.request_url;
  private companies: BehaviorSubject<Company[]> = new BehaviorSubject<Company[]>([]);
  private company: BehaviorSubject<Company> = new BehaviorSubject<Company>({} as Company);
  private users: BehaviorSubject<Employee[]> = new BehaviorSubject<Employee[]>([]);
  private user: BehaviorSubject<Employee> = new BehaviorSubject<Employee>({} as Employee);
  private profiles: BehaviorSubject<ProfileResponse[]> = new BehaviorSubject<ProfileResponse[]>([]);

  constructor(
    private http: HttpClient
  ) {}

  get companies$(): Observable<Company[]> {
    return this.companies.asObservable();
  }

  get company$(): Observable<Company> {
    return this.company.asObservable();
  }

  get users$(): Observable<Employee[]> {
    return this.users.asObservable();
  }

  get user$(): Observable<Employee> {
    return this.user.asObservable();
  }

  get profiles$(): Observable<ProfileResponse[]> {
    return this.profiles.asObservable();
  }

  setCompanies(companies: Company[]) {
    this.companies.next(companies);
  }

  setCompany(company: Company) {
    this.company.next(company);
  }

  setUsers(users: Employee[]) {
    this.users.next(users);
  }

  setUser(user: Employee) {
    this.user.next(user);
  }

  setProfiles(profiles: ProfileResponse[]) {
    this.profiles.next(profiles);
  }

  // Company operations
  getAllCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.request_url}/companies`).pipe(
      tap((response) => {
        this.setCompanies(response);
        return response;
      })
    );
  }

  getAllManagementEntities(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.request_url}/companies/global`).pipe(
      tap((response) => {
        this.setCompanies(response);
        return response;
      })
    );
  }

  getCompanyById(id: string): Observable<Company> {
    return this.http.get<Company>(`${this.request_url}/companies/${id}`).pipe(
      tap((response) => {
        this.setCompany(response);
        return response;
      })
    );
  }

  createCompany(company: CompanyRequest): Observable<Company> {
    return this.http.post<Company>(`${this.request_url}/companies`, company).pipe(
      tap((response) => {
        const currentCompanies = this.companies.getValue();
        this.setCompanies([...currentCompanies, response]);
        return response;
      })
    );
  }

  updateCompany(id: string, company: CompanyRequest): Observable<Company> {
    return this.http.put<Company>(`${this.request_url}/companies/${id}`, company).pipe(
      tap((response) => {
        const currentCompanies = this.companies.getValue();
        const updatedCompanies = currentCompanies.map(c => c.id === id ? response : c);
        this.setCompanies(updatedCompanies);
        return response;
      })
    );
  }

  deleteCompany(id: string): Observable<void> {
    return this.http.delete<void>(`${this.request_url}/companies/${id}`).pipe(
      tap(() => {
        const currentCompanies = this.companies.getValue();
        const updatedCompanies = currentCompanies.filter(c => c.id !== id);
        this.setCompanies(updatedCompanies);
      })
    );
  }

  uploadCompanyLogo(companyId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uuid', companyId);
    return this.http.post(`${this.request_url}/companies/logo`, formData);
  }

  // Employee operations
  getAllUsers(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.request_url}/employees`).pipe(
      tap((response) => {
        this.setUsers(response);
        return response;
      })
    );
  }

  getUserById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.request_url}/employees/${id}`).pipe(
      tap((response) => {
        this.setUser(response);
        return response;
      })
    );
  }

  createUser(employee: EmployeeRequest): Observable<Employee> {
    return this.http.post<Employee>(`${this.request_url}/employees`, employee).pipe(
      tap((response) => {
        const currentUsers = this.users.getValue();
        this.setUsers([...currentUsers, response]);
        return response;
      })
    );
  }

  updateUser(id: string, employee: EmployeeRequest | any): Observable<Employee> {
    return this.http.put<Employee>(`${this.request_url}/employees/${id}`, employee).pipe(
      tap((response) => {
        const currentUsers = this.users.getValue();
        const updatedUsers = currentUsers.map(u => u.id === id ? response : u);
        this.setUsers(updatedUsers);
        this.setUser(response);
        return response;
      })
    );
  }

  activateUser(id: string): Observable<Employee> {
    return this.http.put<Employee>(`${this.request_url}/employees/${id}/activate`, {}).pipe(
      tap((response) => {
        const currentUsers = this.users.getValue();
        const updatedUsers = currentUsers.map(u => u.id === id ? response : u);
        this.setUsers(updatedUsers);
        this.setUser(response);
        return response;
      })
    );
  }

  deactivateUser(id: string): Observable<Employee> {
    return this.http.put<Employee>(`${this.request_url}/employees/${id}/deactivate`, {}).pipe(
      tap((response) => {
        const currentUsers = this.users.getValue();
        const updatedUsers = currentUsers.map(u => u.id === id ? response : u);
        this.setUsers(updatedUsers);
        this.setUser(response);
        return response;
      })
    );
  }

  updateProfiles(uuid: string, profileIds: string[]): Observable<Employee> {
    return this.http.put<Employee>(`${this.request_url}/employees/${uuid}/profiles`, { profileIds }).pipe(
      tap((response) => {
        const currentUsers = this.users.getValue();
        const updatedUsers = currentUsers.map(u => u.id === uuid ? response : u);
        this.setUsers(updatedUsers);
        this.setUser(response);
        return response;
      })
    );
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.request_url}/employees/${id}`).pipe(
      tap(() => {
        const currentUsers = this.users.getValue();
        const updatedUsers = currentUsers.filter(u => u.id !== id);
        this.setUsers(updatedUsers);
      })
    );
  }

  // Profile operations
  getAllProfiles(): Observable<ProfileResponse[]> {
    return this.http.get<ProfileResponse[]>(`${this.request_url}/profiles/all`).pipe(
      tap((response) => {
        this.setProfiles(response);
        return response;
      })
    );
  }

  grantProfileToUser(id: string, profileId: string): Observable<void> {
    return of();
  }

  revokeProfileFromUser(id: string, profileId: string): Observable<void> {
    return of();
  }
}