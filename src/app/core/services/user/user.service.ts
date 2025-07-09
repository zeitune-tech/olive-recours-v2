import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, ReplaySubject, tap } from 'rxjs';
import { User } from './user.interface';
import { environment } from '@env/environment';

@Injectable()
export class UserService{
    private baseUrl = environment.request_url + '/employees';
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);
    private _hasEntity: boolean = false;

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

    hasEntity(): Observable<boolean> {
        return of(this._hasEntity)
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
        return this._httpClient.put<User>(`${this.baseUrl}/update`, {user}).pipe(
            map((response) => {
                this._user.next(response);
            })
        );
    }
}
