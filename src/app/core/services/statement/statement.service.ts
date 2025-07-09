import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class StatementService {

  private baseUrl = environment.base_url + '/app/statements';

  constructor(private http: HttpClient) {}

  /**
   * Get detailed statement between two companies for a given month and year
   */
  getDetailedStatement(companyOpponentId: string, month: number, year: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/summary`, {
      params: {
        companyOpponentId,
        month,
        year
      }
    });
  }

  /**
   * Download detailed statement PDF
   */
  downloadDetailedStatementPdf(companyOpponentId: string, month: number, year: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/summary/pdf`, {
      params: {
        companyOpponentId,
        month,
        year
      },
      responseType: 'blob'
    });
  }

  /**
   * Get global statement summary for a given month and year
   */
  getGlobalStatement(month: number, year: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/global`, {
      params: {
        month,
        year
      }
    });
  }

  /**
   * Download global statement PDF
   */
  downloadGlobalStatementPdf(month: number, year: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/global/pdf`, {
      params: {
        month,
        year
      },
      responseType: 'blob'
    });
  }
}
