import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import {QuittanceResponse} from "./accounting.service";


export interface ModeEncaissementResponse {
  uuid: string;
  libelle: string;
  code: string;
}

export interface PaiementResponse {
  uuid: string;
  montant: number;
  dateEncaissement: string;
  modeEncaissement: ModeEncaissementResponse;
}

// ============= Encaissement Interfaces =============
export interface EncaissementQuittanceResponse {
  uuid: string;
  numero: string;
  quittance: QuittanceResponse;
  montant: number;
  date: string;
}

export interface EncaissementQuittanceGlobalResponse extends EncaissementQuittanceResponse {
  paiement: PaiementResponse;
}

export interface EncaissementQuittanceDetailResponse extends EncaissementQuittanceResponse {
  paiements: PaiementResponse[];
}

// ============= Request DTOs =============
export interface PaiementRequest {
  montant: number;
  dateEncaissement: string;
  modeEncaissementUuid: string;
}

export interface EncaissementQuittanceGlobalRequest {
  numero: string;
  quittanceUuid: string;
  paiement: PaiementRequest;
}

export interface EncaissementQuittanceDetailRequest {
  numero: string;
  quittanceUuid: string;
  paiements: PaiementRequest[];
}

@Injectable({
  providedIn: 'root'
})
export class EncaissementQuittanceService {

  private readonly baseUrl = environment.base_url + '/app';

  constructor(private http: HttpClient) {}

  // ============= Generic Encaissements =============

  /**
   * Get all encaissements
   */
  getAll(): Observable<EncaissementQuittanceResponse[]> {
    return this.http.get<EncaissementQuittanceResponse[]>(`${this.baseUrl}/encaissement-quittance`);
  }

  /**
   * Get encaissement by UUID
   */
  getByUuid(uuid: string): Observable<EncaissementQuittanceResponse> {
    return this.http.get<EncaissementQuittanceResponse>(`${this.baseUrl}/encaissement-quittance/${uuid}`);
  }

  /**
   * Get encaissement by numero
   */
  getByNumero(numero: string): Observable<EncaissementQuittanceResponse> {
    return this.http.get<EncaissementQuittanceResponse>(`${this.baseUrl}/encaissement-quittance/numero/${numero}`);
  }

  /**
   * Get encaissements by quittance UUID
   */
  getByQuittance(quittanceUuid: string): Observable<EncaissementQuittanceResponse[]> {
    return this.http.get<EncaissementQuittanceResponse[]>(
      `${this.baseUrl}/encaissement-quittance/quittance/${quittanceUuid}`
    );
  }

  /**
   * Get encaissements by date range
   */
  getByDateRange(startDate: string, endDate: string): Observable<EncaissementQuittanceResponse[]> {
    return this.http.get<EncaissementQuittanceResponse[]>(`${this.baseUrl}/encaissement-quittance/date-range`, {
      params: { startDate, endDate }
    });
  }

  /**
   * Get total montant by date range
   */
  getTotalMontantByDateRange(startDate: string, endDate: string): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/encaissement-quittance/date-range/total-montant`, {
      params: { startDate, endDate }
    });
  }

  /**
   * Check if encaissement exists by numero
   */
  existsByNumero(numero: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/encaissement-quittance/exists/${numero}`);
  }

  /**
   * Delete encaissement
   */
  delete(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/encaissement-quittance/${uuid}`);
  }

  // ============= Global Encaissements (Single Payment) =============

  /**
   * Get all global encaissements
   */
  getAllGlobal(): Observable<EncaissementQuittanceGlobalResponse[]> {
    return this.http.get<EncaissementQuittanceGlobalResponse[]>(`${this.baseUrl}/encaissement-quittance-global`);
  }

  /**
   * Create global encaissement
   */
  createGlobal(request: EncaissementQuittanceGlobalRequest): Observable<EncaissementQuittanceGlobalResponse> {
    return this.http.post<EncaissementQuittanceGlobalResponse>(
      `${this.baseUrl}/encaissement-quittance-global`, request
    );
  }

  /**
   * Update global encaissement
   */
  updateGlobal(uuid: string, request: EncaissementQuittanceGlobalRequest): Observable<EncaissementQuittanceGlobalResponse> {
    return this.http.put<EncaissementQuittanceGlobalResponse>(
      `${this.baseUrl}/encaissement-quittance-global/${uuid}`, request
    );
  }

  /**
   * Get global encaissement by paiement UUID
   */
  getGlobalByPaiement(paiementUuid: string): Observable<EncaissementQuittanceGlobalResponse> {
    return this.http.get<EncaissementQuittanceGlobalResponse>(
      `${this.baseUrl}/encaissement-quittance-global/paiement/${paiementUuid}`
    );
  }

  /**
   * Get global encaissements by mode encaissement
   */
  getGlobalByModeEncaissement(modeUuid: string): Observable<EncaissementQuittanceGlobalResponse[]> {
    return this.http.get<EncaissementQuittanceGlobalResponse[]>(
      `${this.baseUrl}/encaissement-quittance-global/mode-encaissement/${modeUuid}`
    );
  }

  // ============= Detail Encaissements (Multiple Payments) =============

  /**
   * Get all detail encaissements
   */
  getAllDetail(): Observable<EncaissementQuittanceDetailResponse[]> {
    return this.http.get<EncaissementQuittanceDetailResponse[]>(`${this.baseUrl}/encaissement-quittance-detail`);
  }

  /**
   * Create detail encaissement
   */
  createDetail(request: EncaissementQuittanceDetailRequest): Observable<EncaissementQuittanceDetailResponse> {
    return this.http.post<EncaissementQuittanceDetailResponse>(
      `${this.baseUrl}/encaissement-quittance-detail`, request
    );
  }

  /**
   * Update detail encaissement
   */
  updateDetail(uuid: string, request: EncaissementQuittanceDetailRequest): Observable<EncaissementQuittanceDetailResponse> {
    return this.http.put<EncaissementQuittanceDetailResponse>(
      `${this.baseUrl}/encaissement-quittance-detail/${uuid}`, request
    );
  }

  /**
   * Get detail encaissements by paiement UUID
   */
  getDetailByPaiement(paiementUuid: string): Observable<EncaissementQuittanceDetailResponse[]> {
    return this.http.get<EncaissementQuittanceDetailResponse[]>(
      `${this.baseUrl}/encaissement-quittance-detail/paiement/${paiementUuid}`
    );
  }

  /**
   * Get paiements count for detail encaissement
   */
  getPaiementsCount(encaissementUuid: string): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/encaissement-quittance-detail/${encaissementUuid}/paiements/count`);
  }

  /**
   * Get detail encaissements with minimum paiements
   */
  getDetailWithMinPaiements(minPaiements: number): Observable<EncaissementQuittanceDetailResponse[]> {
    return this.http.get<EncaissementQuittanceDetailResponse[]>(
      `${this.baseUrl}/encaissement-quittance-detail/min-paiements/${minPaiements}`
    );
  }

  // ============= Helper Methods =============

  /**
   * Get modes encaissement (for dropdown)
   */
  getModesEncaissement(): Observable<ModeEncaissementResponse[]> {
    return this.http.get<ModeEncaissementResponse[]>(`${this.baseUrl}/mode-encaissement`);
  }

  /**
   * Calculate solde for a quittance
   */
  calculateSoldeQuittance(quittance: QuittanceResponse, encaissements: EncaissementQuittanceResponse[]): number {
    const totalEncaisse = encaissements.reduce((sum, enc) => sum + enc.montant, 0);
    return quittance.montant - totalEncaisse;
  }

  /**
   * Get encaissement status
   */
  getEncaissementStatus(quittance: QuittanceResponse, encaissements: EncaissementQuittanceResponse[]): 'NON_ENCAISSE' | 'PARTIEL' | 'ENCAISSE' {
    const totalEncaisse = encaissements.reduce((sum, enc) => sum + enc.montant, 0);

    if (totalEncaisse === 0) return 'NON_ENCAISSE';
    if (totalEncaisse < quittance.montant) return 'PARTIEL';
    return 'ENCAISSE';
  }
}
