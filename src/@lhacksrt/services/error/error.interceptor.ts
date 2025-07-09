// error-interceptor.ts
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorDialogComponent } from './error-dialog.component';
import { ErrorDialogQueueService } from './error-dialog-queue.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(
        private _errorDialogQueueService: ErrorDialogQueueService
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 0) {
                    // Network error or server is down
                    this._errorDialogQueueService.addErrorToQueue('Network error. Please check your connection.');
                } 
                return throwError(() => new Error(error.message));
            })
        );
    }
}
