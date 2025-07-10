import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfilesService {

  private baseUrl = environment.request_url;

  constructor(private http: HttpClient) { }

  updatePersonalInfos(data: { firstname: string; lastname: string; email: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/profiles/personal-infos`, data);
  }

  updateCompany(data: {
    name: string;
    acronym: string;
    email: string;
    phone: string;
    address: string;
    logo?: string;
    fax?: string;
    gsm?: string;
    legalStatus?: string;
    registrationNumber?: string;
  }): Observable<any> {
    return this.http.put(`${this.baseUrl}/profiles/company`, data);
  }

  updatePassword(data: { oldPassword: string; newPassword: string; confirmNewPassword: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/profiles/password`, data);
  }
}
