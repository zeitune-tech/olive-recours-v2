import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaces for Encashment
export interface EncaissementQuittanceRequestDto {
  // Define properties based on your backend model
  quittanceUuid?: string;
  montant?: number;
  dateEncaissement?: string;
  modeReglement?: string;
  reference?: string;
  commentaire?: string;
}

export interface EncaissementQuittanceResponseDto {
  uuid?: string;
  quittanceUuid?: string;
  montant?: number;
  dateEncaissement?: string;
  modeReglement?: string;
  reference?: string;
  commentaire?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountingService {

  private base_path = environment.request_url + '/accounting';

  constructor(private http: HttpClient) { }

  // Encashment methods
  createEncashment(requestDto: EncaissementQuittanceRequestDto): Observable<EncaissementQuittanceResponseDto> {
    return this.http.post<EncaissementQuittanceResponseDto>(this.base_path, requestDto);
  }

  getEncashmentByUuid(uuid: string): Observable<EncaissementQuittanceResponseDto> {
    return this.http.get<EncaissementQuittanceResponseDto>(`${this.base_path}/${uuid}`);
  }

  getAllEncashments(): Observable<EncaissementQuittanceResponseDto[]> {
    return this.http.get<EncaissementQuittanceResponseDto[]>(this.base_path);
  }

  updateEncashment(uuid: string, requestDto: EncaissementQuittanceRequestDto): Observable<EncaissementQuittanceResponseDto> {
    return this.http.put<EncaissementQuittanceResponseDto>(`${this.base_path}/${uuid}`, requestDto);
  }

  deleteEncashment(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.base_path}/${uuid}`);
  }

  getEncashmentsByQuittance(quittanceUuid: string): Observable<EncaissementQuittanceResponseDto[]> {
    return this.http.get<EncaissementQuittanceResponseDto[]>(`${this.base_path}/quittance/${quittanceUuid}`);
  }

  generateEtatEncaissementPdf(uuid: string): Observable<Blob> {
    return this.http.get(`${this.base_path}/${uuid}/etat-encaissement`, {
      responseType: 'blob'
    });
  }

  generateEtatReglementPdf(uuid: string): Observable<Blob> {
    return this.http.get(`${this.base_path}/${uuid}/etat-reglement`, {
      responseType: 'blob'
    });
  }
}
