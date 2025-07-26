import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ManagementEntityResponse, MarketLevelOrganisationRequest, MarketLevelOrganizationResponse } from './dto';

@Injectable({
  providedIn: 'root'
})
export class MarketLevelOrganizationService {

  private readonly request_url = environment.request_url;
  private organizations: BehaviorSubject<MarketLevelOrganizationResponse[]> = new BehaviorSubject<MarketLevelOrganizationResponse[]>([]);
  private organization: BehaviorSubject<MarketLevelOrganizationResponse> = new BehaviorSubject<MarketLevelOrganizationResponse>({} as MarketLevelOrganizationResponse);

  constructor(
    private http: HttpClient
  ) {}

  get organizations$(): Observable<MarketLevelOrganizationResponse[]> {
    return this.organizations.asObservable();
  }

  get organization$(): Observable<MarketLevelOrganizationResponse> {
    return this.organization.asObservable();
  }

  setOrganizations(organizations: MarketLevelOrganizationResponse[]) {
    this.organizations.next(organizations);
  }

  setOrganization(organization: MarketLevelOrganizationResponse) {
    this.organization.next(organization);
  }

  // Market Level Organization operations
  getAllOrganizations(): Observable<MarketLevelOrganizationResponse[]> {
    return this.http.get<MarketLevelOrganizationResponse[]>(`${this.request_url}/market-level-organizations`).pipe(
      tap((response) => {
        this.setOrganizations(response);
        return response;
      })
    );
  }

  getOrganizationById(id: string): Observable<MarketLevelOrganizationResponse> {
    return this.http.get<MarketLevelOrganizationResponse>(`${this.request_url}/market-level-organizations/${id}`).pipe(
      tap((response) => {
        this.setOrganization(response);
        return response;
      })
    );
  }

  createOrganization(organization: MarketLevelOrganisationRequest): Observable<MarketLevelOrganizationResponse> {
    return this.http.post<MarketLevelOrganizationResponse>(`${this.request_url}/market-level-organizations`, organization).pipe(
      tap((response) => {
        const currentOrganizations = this.organizations.getValue();
        this.setOrganizations([...currentOrganizations, response]);
        return response;
      })
    );
  }

  updateOrganization(id: string, organization: MarketLevelOrganisationRequest): Observable<MarketLevelOrganizationResponse> {
    return this.http.put<MarketLevelOrganizationResponse>(`${this.request_url}/market-level-organizations/${id}`, organization).pipe(
      tap((response) => {
        const currentOrganizations = this.organizations.getValue();
        const updatedOrganizations = currentOrganizations.map(o => o.id === id ? response : o);
        this.setOrganizations(updatedOrganizations);
        return response;
      })
    );
  }

  deleteOrganization(id: string): Observable<void> {
    return this.http.delete<void>(`${this.request_url}/market-level-organizations/${id}`).pipe(
      tap(() => {
        const currentOrganizations = this.organizations.getValue();
        const updatedOrganizations = currentOrganizations.filter(o => o.id !== id);
        this.setOrganizations(updatedOrganizations);
      })
    );
  }

  uploadOrganizationLogo(organizationId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uuid', organizationId);
    return this.http.post(`${this.request_url}/market-level-organizations/logo`, formData);
  }
}