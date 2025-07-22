import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { catchError, map, Observable, ReplaySubject, tap, throwError } from "rxjs";
import { Claim } from "./claim.interface";
import { environment } from "@env/environment";
import { ClaimStatus } from "./claim-status.enum";

@Injectable({
    providedIn: 'root'
})
export class ClaimService {

    private baseUrl = environment.base_url + '/app/claims';
    private attachmentsUrl = environment.base_url + '/app/attachments';
    private _claim: ReplaySubject<Claim> = new ReplaySubject<Claim>(1);
    private _claims: ReplaySubject<Claim[]> = new ReplaySubject<Claim[]>(1);

    constructor(private _httpClient: HttpClient) { }

    set claim(value: Claim) {
        this._claim.next(value);
    }

    get claim$() {
        return this._claim.asObservable();
    }

    set claims(value: Claim[]) {
        this._claims.next(value);
    }

    get claims$() {
        return this._claims.asObservable();
    }

    getAll(): Observable<Claim[]> {
        return this._httpClient.get<Claim[]>(`${this.baseUrl}/company`)
            .pipe(tap(claims => this.claims = claims));
    }

    getByUuid(uuid: string): Observable<Claim> {
        return this._httpClient.get<Claim>(`${this.baseUrl}/${uuid}`)
            .pipe(tap(claim => this.claim = claim));
    }

    create(claim: any): Observable<Claim> {
        return this._httpClient.post<Claim>(`${this.baseUrl}`, claim);
    }

    update(uuid: string, claim: Claim): Observable<Claim> {
        return this._httpClient.put<Claim>(`${this.baseUrl}/${uuid}`, claim);
    }

    delete(uuid: string): Observable<void> {
        return this._httpClient.delete<void>(`${this.baseUrl}/${uuid}`);
    }

    /**
     * Met à jour le statut d'un recours, et peut envoyer une date si précisée.
     * @param uuid
     * @param statusOrPayload soit le statut (string), soit un objet { status, date? }
     */
    updateStatus(uuid: string, statusOrPayload: ClaimStatus | { status: ClaimStatus, date?: string }): Observable<Claim> {
        let payload: any;
        if (typeof statusOrPayload === 'object') {
            payload = statusOrPayload;
        } else {
            payload = { status: statusOrPayload };
        }
        return this._httpClient.patch<Claim>(`${this.baseUrl}/${uuid}/status`, payload);
    }

    uploadAttachment(payload: FormData): Observable<any> {
        return this._httpClient.post(`${this.attachmentsUrl}/upload`, payload);
    }
    
    getAttachmentsByClaimId(uuid: string): Observable<any> {
        return this._httpClient.get(`${this.attachmentsUrl}/claim/${uuid}`);
    }

    downloadAttachment(uuid: string, fileName: string): Observable<void> {
        return this._httpClient.get(`${this.attachmentsUrl}/download/${uuid}`, {
          responseType: 'blob',
          observe: 'response'
        }).pipe(
          tap((response: HttpResponse<Blob>) => {
            console.log(response);
            const contentDisposition = response.headers.get('content-disposition');
            const filename = fileName || contentDisposition?.split('filename=')[1]?.replace(/['"]/g, '') || `attachment-${uuid}`;
            const blob = new Blob([response.body!], { type: response.headers.get('content-type') || 'application/octet-stream' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          }),
          map(() => void 0), // Return void since the method triggers a download
          catchError(error => {
            console.error('Download failed:', error);
            return throwError(() => new Error('Failed to download attachment'));
          })
        );
      }
}
