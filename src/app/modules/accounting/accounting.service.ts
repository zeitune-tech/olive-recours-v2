import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ============= DTOs pour Quittance =============
export interface QuittanceRequest {
  numero: string;
  nature: string; // ou enum selon votre implémentation
  montant: number;
  sortQuittance?: number;
  dateSortQuittance?: string;
  quittanceClaims?: QuittanceClaimRequest[];
}

export interface QuittanceResponse {
  uuid: string;
  numero: string;
  nature: string;
  montant: number;
  sortQuittance?: number;
  dateSortQuittance?: string;
  quittanceClaims?: QuittanceClaimResponse[];
}

// ============= DTOs pour QuittanceClaim =============
export interface QuittanceClaimRequest {
  quittanceId: string;
  montant: number;
  payerCompanyId?: number;
  receiverCompanyId?: number;
  claimIds?: number[];
  encaissementQuittanceClaims?: EncaissementQuittanceClaimRequest[];
}

export interface QuittanceClaimResponse {
  uuid: string;
  quittance: QuittanceResponse;
  montant: number;
  payerCompany?: any; // Remplacez par le bon type Company
  receiverCompany?: any;
  claims?: any[]; // Remplacez par le bon type Claim
  encaissementQuittanceClaims?: EncaissementQuittanceClaimResponse[];
}

// ============= DTOs pour EncaissementQuittanceClaim =============
export interface EncaissementQuittanceClaimRequest {
  quittanceClaimId: string;
  modeEncaissementId: string;
  montantEncaisse: number;
  dateEncaissement: string;
  numero?: string;
}

export interface EncaissementQuittanceClaimResponse {
  uuid: string;
  quittanceClaim: QuittanceClaimResponse;
  modeEncaissement: ModeEncaissementResponse;
  montantEncaisse: number;
  dateEncaissement: string;
  numero?: string;
}

// ============= DTOs pour ModeEncaissement =============
export interface ModeEncaissementResponse {
  uuid: string;
  libelle: string;
  description?: string;
  dateCreation: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountingService {

  private readonly quittanceUrl = environment.request_url + '/quittance';
  private readonly quittanceClaimUrl = environment.request_url + '/quittance-claim';
  private readonly encaissementUrl = environment.request_url + '/encaissement-quittance-claim';
  private readonly modeEncaissementUrl = environment.request_url + '/mode-encaissement';

  constructor(private http: HttpClient) { }

  // ============= QUITTANCE METHODS =============

  // Quittance CRUD
  createQuittance(request: QuittanceRequest): Observable<QuittanceResponse> {
    return this.http.post<QuittanceResponse>(this.quittanceUrl, request);
  }

  getQuittanceByUuid(uuid: string): Observable<QuittanceResponse> {
    return this.http.get<QuittanceResponse>(`${this.quittanceUrl}/${uuid}`);
  }

  getAllQuittances(): Observable<QuittanceResponse[]> {
    return this.http.get<QuittanceResponse[]>(this.quittanceUrl);
  }

  getAllQuittancesByCompany(uuid: string): Observable<QuittanceResponse[]> {
    return this.http.get<QuittanceResponse[]>(this.quittanceUrl+`/company/${uuid}`);
  }

  updateQuittance(uuid: string, request: QuittanceRequest): Observable<QuittanceResponse> {
    return this.http.put<QuittanceResponse>(`${this.quittanceUrl}/${uuid}`, request);
  }

  deleteQuittance(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.quittanceUrl}/${uuid}`);
  }

  // ============= QUITTANCE CLAIM METHODS =============

  // QuittanceClaim CRUD
  createQuittanceClaim(request: QuittanceClaimRequest): Observable<QuittanceClaimResponse> {
    return this.http.post<QuittanceClaimResponse>(this.quittanceClaimUrl, request);
  }

  getQuittanceClaimByUuid(uuid: string): Observable<QuittanceClaimResponse> {
    return this.http.get<QuittanceClaimResponse>(`${this.quittanceClaimUrl}/${uuid}`);
  }

  getAllQuittanceClaims(): Observable<QuittanceClaimResponse[]> {
    return this.http.get<QuittanceClaimResponse[]>(this.quittanceClaimUrl);
  }

  getQuittanceClaimsByQuittance(quittanceUuid: string): Observable<QuittanceClaimResponse[]> {
    return this.http.get<QuittanceClaimResponse[]>(`${this.quittanceClaimUrl}/quittance/${quittanceUuid}`);
  }

  updateQuittanceClaim(uuid: string, request: QuittanceClaimRequest): Observable<QuittanceClaimResponse> {
    return this.http.put<QuittanceClaimResponse>(`${this.quittanceClaimUrl}/${uuid}`, request);
  }

  deleteQuittanceClaim(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.quittanceClaimUrl}/${uuid}`);
  }

  // ============= ENCAISSEMENT QUITTANCE CLAIM METHODS =============

  // EncaissementQuittanceClaim CRUD
  createEncaissement(request: EncaissementQuittanceClaimRequest): Observable<EncaissementQuittanceClaimResponse> {
    return this.http.post<EncaissementQuittanceClaimResponse>(this.encaissementUrl, request);
  }

  getEncaissementByUuid(uuid: string): Observable<EncaissementQuittanceClaimResponse> {
    return this.http.get<EncaissementQuittanceClaimResponse>(`${this.encaissementUrl}/${uuid}`);
  }

  getAllEncaissements(): Observable<EncaissementQuittanceClaimResponse[]> {
    return this.http.get<EncaissementQuittanceClaimResponse[]>(this.encaissementUrl);
  }

  getEncaissementsByQuittanceClaim(quittanceClaimUuid: string): Observable<EncaissementQuittanceClaimResponse[]> {
    return this.http.get<EncaissementQuittanceClaimResponse[]>(`${this.encaissementUrl}/quittance-claim/${quittanceClaimUuid}`);
  }

  updateEncaissement(uuid: string, request: EncaissementQuittanceClaimRequest): Observable<EncaissementQuittanceClaimResponse> {
    return this.http.put<EncaissementQuittanceClaimResponse>(`${this.encaissementUrl}/${uuid}`, request);
  }

  deleteEncaissement(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.encaissementUrl}/${uuid}`);
  }

  // ============= MODE ENCAISSEMENT METHODS =============

  // ModeEncaissement read-only (gestion dans params)
  getAllModesEncaissement(): Observable<ModeEncaissementResponse[]> {
    return this.http.get<ModeEncaissementResponse[]>(this.modeEncaissementUrl);
  }

  getModeEncaissementByUuid(uuid: string): Observable<ModeEncaissementResponse> {
    return this.http.get<ModeEncaissementResponse>(`${this.modeEncaissementUrl}/${uuid}`);
  }

  // ============= REPORTS & PDF GENERATION =============

  // Génération de PDFs d'états
  generateEtatEncaissementPdf(quittanceUuid: string): Observable<Blob> {
    return this.http.get(`${this.quittanceUrl}/${quittanceUuid}/etat-encaissement`, {
      responseType: 'blob'
    });
  }

  generateEtatReglementPdf(quittanceUuid: string): Observable<Blob> {
    return this.http.get(`${this.quittanceUrl}/${quittanceUuid}/etat-reglement`, {
      responseType: 'blob'
    });
  }

  generateQuittancePdf(quittanceUuid: string): Observable<Blob> {
    return this.http.get(`${this.quittanceUrl}/${quittanceUuid}/pdf`, {
      responseType: 'blob'
    });
  }

  // ============= BUSINESS LOGIC METHODS =============

  // Méthodes métier utiles
  getQuittanceWithFullDetails(uuid: string): Observable<QuittanceResponse> {
    // Cette méthode pourrait inclure des paramètres pour charger les relations
    return this.http.get<QuittanceResponse>(`${this.quittanceUrl}/${uuid}?include=claims,encaissements`);
  }

  getEncaissementsStatsByPeriod(startDate: string, endDate: string): Observable<any> {
    return this.http.get(`${this.encaissementUrl}/stats`, {
      params: { startDate, endDate }
    });
  }

  validateQuittance(uuid: string): Observable<QuittanceResponse> {
    return this.http.patch<QuittanceResponse>(`${this.quittanceUrl}/${uuid}/validate`, {});
  }

  // ============= SEARCH & FILTER METHODS =============

  searchQuittances(filters: any): Observable<QuittanceResponse[]> {
    return this.http.post<QuittanceResponse[]>(`${this.quittanceUrl}/search`, filters);
  }

  getEncaissementsByDateRange(startDate: string, endDate: string): Observable<EncaissementQuittanceClaimResponse[]> {
    return this.http.get<EncaissementQuittanceClaimResponse[]>(`${this.encaissementUrl}/by-date-range`, {
      params: { startDate, endDate }
    });
  }

  getEncaissementsByModeEncaissement(modeEncaissementUuid: string): Observable<EncaissementQuittanceClaimResponse[]> {
    return this.http.get<EncaissementQuittanceClaimResponse[]>(`${this.encaissementUrl}/by-mode/${modeEncaissementUuid}`);
  }
}
