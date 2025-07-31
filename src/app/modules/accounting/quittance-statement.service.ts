import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

// ============= DTOs for Quittance Statements =============
export interface QuittanceStatementSummary {
  companyUuid: string;
  companyName: string;
  companyCode: string;
  nature: 'ENCAISSEMENT' | 'REGLEMENT';
  period: string;
  nombreQuittances: number;
  totalMontantQuittances: number;
  generationDate: string;
  generatedBy: string;
  quittanceLines: QuittanceStatementLine[];
}

export interface QuittanceStatementLine {
  quittanceUuid: string;
  quittanceNumero: string;
  montantQuittance: number;
  dateSortQuittance: string;
  claimNumero?: string;
  claimReference?: string;
  nombreEncaissements: number;
  totalMontantEncaisse: number;
}

export interface EncaissementStatementSummary {
  companyUuid: string;
  companyName: string;
  companyCode: string;
  period: string;
  nombreEncaissementsGlobaux: number;
  nombreEncaissementsDetails: number;
  nombreTotalEncaissements: number;
  nombreQuittancesAssociees: number;
  totalMontantEncaissements: number;
  totalMontantQuittancesAssociees: number;
  generationDate: string;
  generatedBy: string;
  encaissementLines: EncaissementStatementLine[];
}

export interface EncaissementStatementLine {
  encaissementUuid: string;
  encaissementNumero: string;
  typeEncaissement: 'GLOBAL' | 'DETAIL';
  dateEncaissement: string;
  montantEncaissement: number;
  quittanceUuid?: string;
  quittanceNumero?: string;
  montantQuittance?: number;
  dateSortQuittance?: string;
  claimNumero?: string;
  claimReference?: string;
  modeEncaissement?: string;
  paiementDetails?: PaiementDetail[];
}

export interface PaiementDetail {
  uuid: string;
  montant: number;
  dateEncaissement: string;
  modeEncaissement: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuittanceStatementService {
  
  private readonly baseUrl = environment.base_url + '/app/quittance-statements';

  constructor(private http: HttpClient) {}

  // ============= ENCAISSEMENT QUITTANCE STATEMENTS =============
  
  /**
   * Get encaissement statement by period
   */
  getEncaissementStatement(companyUuid: string, startDate: string, endDate: string): Observable<QuittanceStatementSummary> {
    return this.http.get<QuittanceStatementSummary>(`${this.baseUrl}/encaissement`, {
      params: { companyUuid, startDate, endDate }
    });
  }

  /**
   * Get monthly encaissement statement
   */
  getMonthlyEncaissementStatement(companyUuid: string, month: number, year: number): Observable<QuittanceStatementSummary> {
    return this.http.get<QuittanceStatementSummary>(`${this.baseUrl}/encaissement/monthly`, {
      params: { companyUuid, month: month.toString(), year: year.toString() }
    });
  }

  /**
   * Download encaissement statement PDF by period
   */
  downloadEncaissementStatementPdf(companyUuid: string, startDate: string, endDate: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/encaissement/pdf`, {
      params: { companyUuid, startDate, endDate },
      responseType: 'blob'
    });
  }

  /**
   * Download monthly encaissement statement PDF
   */
  downloadMonthlyEncaissementStatementPdf(companyUuid: string, month: number, year: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/encaissement/monthly/pdf`, {
      params: { companyUuid, month: month.toString(), year: year.toString() },
      responseType: 'blob'
    });
  }

  // ============= REGLEMENT QUITTANCE STATEMENTS =============
  
  /**
   * Get reglement statement by period
   */
  getReglementStatement(companyUuid: string, startDate: string, endDate: string): Observable<QuittanceStatementSummary> {
    return this.http.get<QuittanceStatementSummary>(`${this.baseUrl}/reglement`, {
      params: { companyUuid, startDate, endDate }
    });
  }

  /**
   * Get monthly reglement statement
   */
  getMonthlyReglementStatement(companyUuid: string, month: number, year: number): Observable<QuittanceStatementSummary> {
    return this.http.get<QuittanceStatementSummary>(`${this.baseUrl}/reglement/monthly`, {
      params: { companyUuid, month: month.toString(), year: year.toString() }
    });
  }

  /**
   * Download reglement statement PDF by period
   */
  downloadReglementStatementPdf(companyUuid: string, startDate: string, endDate: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/reglement/pdf`, {
      params: { companyUuid, startDate, endDate },
      responseType: 'blob'
    });
  }

  /**
   * Download monthly reglement statement PDF
   */
  downloadMonthlyReglementStatementPdf(companyUuid: string, month: number, year: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/reglement/monthly/pdf`, {
      params: { companyUuid, month: month.toString(), year: year.toString() },
      responseType: 'blob'
    });
  }

  // ============= ENCAISSEMENT GENERAL STATEMENTS =============
  
  /**
   * Get encaissements statement by period
   */
  getEncaissementsStatement(companyUuid: string, startDate: string, endDate: string): Observable<EncaissementStatementSummary> {
    return this.http.get<EncaissementStatementSummary>(`${this.baseUrl}/encaissements`, {
      params: { companyUuid, startDate, endDate }
    });
  }

  /**
   * Get monthly encaissements statement
   */
  getMonthlyEncaissementsStatement(companyUuid: string, month: number, year: number): Observable<EncaissementStatementSummary> {
    return this.http.get<EncaissementStatementSummary>(`${this.baseUrl}/encaissements/monthly`, {
      params: { companyUuid, month: month.toString(), year: year.toString() }
    });
  }

  /**
   * Download encaissements statement PDF by period
   */
  downloadEncaissementsStatementPdf(companyUuid: string, startDate: string, endDate: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/encaissements/pdf`, {
      params: { companyUuid, startDate, endDate },
      responseType: 'blob'
    });
  }

  /**
   * Download monthly encaissements statement PDF
   */
  downloadMonthlyEncaissementsStatementPdf(companyUuid: string, month: number, year: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/encaissements/monthly/pdf`, {
      params: { companyUuid, month: month.toString(), year: year.toString() },
      responseType: 'blob'
    });
  }
}