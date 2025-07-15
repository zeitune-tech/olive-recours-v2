import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { PermissionResponse, ProfileRequest, ProfileResponse } from '../users/dto';


@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private readonly base_url = environment.base_url;
  private readonly request_url = environment.request_url;
  private profiles: BehaviorSubject<ProfileResponse[]> = new BehaviorSubject<ProfileResponse[]>([]);
  private permissions: BehaviorSubject<PermissionResponse[]> = new BehaviorSubject<PermissionResponse[]>([]);

  constructor(
    private http: HttpClient
  ) {}

  get profiles$(): Observable<ProfileResponse[]> {
    return this.profiles.asObservable();
  }

  get permissions$(): Observable<PermissionResponse[]> {
    return this.permissions.asObservable();
  }

  setPermissions(permissions: PermissionResponse[]) {
    this.permissions.next(permissions);
  }

  setProfiles(profiles: ProfileResponse[]) {
    this.profiles.next(profiles);
  }


  getAllPermissions(): Observable<PermissionResponse[]> {
    return this.http.get<PermissionResponse[]>(`${this.request_url}/profiles/permissions`).pipe(
      tap((response) => {
        this.setPermissions(response);
        return response;
      })
    );
  }

  getAllProfiles(): Observable<ProfileResponse[]> {
    return this.http.get<ProfileResponse[]>(`${this.request_url}/profiles`).pipe(
      tap((response) => {
        this.setProfiles(response);
        return response;
      })
    );
  }

  createProfile(profile: ProfileRequest): Observable<ProfileResponse> {
    return this.http.post<ProfileResponse>(`${this.request_url}/profiles`, profile).pipe(
      tap((response) => {
        const currentProfiles = this.profiles.getValue();
        this.setProfiles([...currentProfiles, response]);
        return response;
      })
    );
  }

  updateProfile(id: string, profile: ProfileRequest): Observable<ProfileResponse> {
    return this.http.put<ProfileResponse>(`${this.request_url}/profiles/${id}`, profile).pipe(
      tap((response) => {
        const currentProfiles = this.profiles.getValue();
        const updatedProfiles = currentProfiles.map(p => p.id === id ? response : p);
        this.setProfiles(updatedProfiles);
        return response;
      })
    );
  }

  deleteProfile(id: string): Observable<void> {
    return this.http.delete<void>(`${this.request_url}/profiles/${id}`).pipe(
      tap(() => {
        const currentProfiles = this.profiles.getValue();
        const updatedProfiles = currentProfiles.filter(p => p.id !== id);
        this.setProfiles(updatedProfiles);
      })
    );
  }
}