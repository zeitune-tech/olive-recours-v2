import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, ReplaySubject, tap } from 'rxjs';
import { User } from './user.interface';
import { environment } from '@env/environment';
import { ManagementEntity } from '../management-entity/management-entity.interface';
import { ManagementEntityType } from 'src/app/modules/admin/users/dto';

@Injectable()
export class UserService{
    private baseUrl = environment.request_url + '/employees';
    private request_url = environment.request_url;
    private _managementEntityBaseUrl = environment.request_url + '/companies';
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);
    private _managementEntity: ReplaySubject<ManagementEntity> = new ReplaySubject<ManagementEntity>(1);
    private _hasEntity: boolean = false;
    private _permissions: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
    private _level: BehaviorSubject<ManagementEntityType | null> = new BehaviorSubject<ManagementEntityType | null>(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User) {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<User> {
        return this._user.asObservable();
    }

    get managementEntity$(): Observable<ManagementEntity> {
        return this._managementEntity.asObservable();
    }

    set managementEntity(value: ManagementEntity) {
        // Store the value
        this._managementEntity.next(value);
    }

    hasEntity(): Observable<boolean> {
        return of(this._hasEntity)
    }

    get permissions$(): Observable<string[]> {
        return this._permissions.asObservable();
    }

    set permissions(value: string[]) {
        // Store the value
        this._permissions.next(value);
    }

    get level$(): Observable<ManagementEntityType | null> {
        return this._level.asObservable();
    }

    set level(value: ManagementEntityType | null) {
        // Store the value
        this._level.next(value);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current logged in user data
     */
    get(): Observable<User> {
        // First try to get from the subject
      
        return this._httpClient.get<User>(`${this.baseUrl}/me`).pipe(
            tap((user) => {
                this.user = user;
                if (user.managementEntity)
                    this._hasEntity = true;
                if(user.permissions)
                    this.permissions = user.permissions;
                if(user.profileType){
                    this.level = user.profileType;
                }
            }),
            catchError(() => of({} as User))
        );
    }

    /**
     * Update the user
     *
     * @param user
     */
    update(user: User): Observable<any> {
        return this._httpClient.put<User>(`${this.baseUrl}/${user.id}`, user).pipe(
            map((response) => {
                this._user.next(response);
                if(response.permissions)
                    this.permissions = response.permissions;
            })
        );
    }

    updateManagementEntity(entity: ManagementEntity): Observable<any> {
        return this._httpClient.put<ManagementEntity>(`${this._managementEntityBaseUrl}/update`, entity).pipe(
            map((response) => {
                this._managementEntity.next({...response});
            })
        );
    }

    getManagementEntity(): Observable<ManagementEntity> {
        return this._httpClient.get<ManagementEntity>(`${this._managementEntityBaseUrl}/me`).pipe(
            tap((entity) => {
                this.managementEntity = entity;
            }),
            catchError(() => of({} as ManagementEntity))
        );
    }

    uploadFile(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        
        return this._httpClient.post(`${this._managementEntityBaseUrl}/logo`, formData);
    }

    updatePersonalInfos(data: { firstname: string; lastname: string; email: string }): Observable<any> {
        return this._httpClient.put(`${this.request_url}/profiles/personal-infos`, data).pipe(
            map((response) => {
                this._user.next(response as User);
            })
        );
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
        return this._httpClient.put(`${this.request_url}/profiles/company`, data).pipe(
            map((response) => {
                this._managementEntity.next(response as ManagementEntity);
            })
        );
      }
    
      updatePassword(data: { oldPassword: string; newPassword: string; confirmNewPassword: string }): Observable<any> {
        return this._httpClient.put(`${this.request_url}/employees/me/password`, data);
      }
}
