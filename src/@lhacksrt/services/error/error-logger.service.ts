// log-error.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ErrorLoggerService {

    private logUrl = `${environment.base_url}/log-error`;  // Replace with your backend logging endpoint

    constructor(
        private http: HttpClient
    ) {}

    /**
     * Log the error to the backend or third-party service
     * @param error The error object or message to log
     */
    log(error: any): void {
        // this.http.post(this.logUrl, { error: JSON.stringify(error) }).subscribe();

        // For demo purposes
        console.error('Error logged:', error);
    }
}
