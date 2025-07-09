import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthUtils } from './auth.utils';
import { TokenService } from './token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private _tokenService: TokenService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Clone the request object
        let headers = req.headers;

        // Get the access token
        const accessToken = this._tokenService.accessToken;

        // If the access token exists and is valid, add it to the request headers
        if (accessToken && !AuthUtils.isTokenExpired(accessToken)) {
            headers = headers.set('Authorization', `Bearer ${accessToken}`);
        }

        // Retrieve user type from storage (adjust according to your logic)
        const userType = 'ADMIN';
        
        // Set X-User-Type header
        headers = headers.set('X-User-Type', userType);

        // Clone request with updated headers
        const newReq = req.clone({ headers });

        return next.handle(newReq).pipe(
            catchError((error) => {
                // Catch "401 Unauthorized" responses
                if (error instanceof HttpErrorResponse && error.status === 401) {
                    this._tokenService.clearTokens();
                    // Optionally: location.reload();
                }

                return throwError(() => error);
            })
        );
    }
}