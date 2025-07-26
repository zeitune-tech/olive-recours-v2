import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from '@env/environment';
import { MarketLevelOrganisationRequest, MarketLevelOrganizationResponse, UpdateMarketLevelOrganizationRequest } from '../dto';

@Injectable({
  providedIn: 'root'
})
export class MarketLevelOrganizationService {
  private apiUrl = `${environment.request_url}/market-level-organizations`;
  private organizationsSubject = new BehaviorSubject<MarketLevelOrganizationResponse[]>([]);
  organizations$ = this.organizationsSubject.asObservable();

  constructor(private http: HttpClient) { }

  getAllOrganizations(): Observable<MarketLevelOrganizationResponse[]> {
    return this.http.get<MarketLevelOrganizationResponse[]>(this.apiUrl).pipe(
      tap(organizations => this.organizationsSubject.next(organizations))
    );
  }

  getOrganizationById(id: string): Observable<MarketLevelOrganizationResponse> {
    return this.http.get<MarketLevelOrganizationResponse>(`${this.apiUrl}/${id}`);
  }

  createOrganization(organization: MarketLevelOrganisationRequest): Observable<MarketLevelOrganizationResponse> {
    return this.http.post<MarketLevelOrganizationResponse>(this.apiUrl, organization).pipe(
      tap(newOrganization => {
        const currentOrganizations = this.organizationsSubject.value;
        this.organizationsSubject.next([...currentOrganizations, newOrganization]);
      })
    );
  }

  updateOrganization(id: string, organization: UpdateMarketLevelOrganizationRequest): Observable<MarketLevelOrganizationResponse> {
    return this.http.put<MarketLevelOrganizationResponse>(`${this.apiUrl}/${id}`, organization).pipe(
      tap(updatedOrganization => {
        const currentOrganizations = this.organizationsSubject.value;
        const index = currentOrganizations.findIndex(org => org.id === updatedOrganization.id);
        if (index !== -1) {
          const updatedOrganizations = [...currentOrganizations];
          updatedOrganizations[index] = updatedOrganization;
          this.organizationsSubject.next(updatedOrganizations);
        }
      })
    );
  }

  deleteOrganization(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentOrganizations = this.organizationsSubject.value;
        const updatedOrganizations = currentOrganizations.filter(org => org.id.toString() !== id);
        this.organizationsSubject.next(updatedOrganizations);
      })
    );
  }

  uploadOrganizationLogo(id: string, logo: File): Observable<any> {
    const formData = new FormData();
    formData.append('logo', logo);
    return this.http.post<any>(`${this.apiUrl}/${id}/logo`, formData);
  }
}