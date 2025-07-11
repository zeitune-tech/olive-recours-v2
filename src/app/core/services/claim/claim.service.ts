import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, ReplaySubject, tap } from "rxjs";
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

    updateStatus(uuid: string, status: ClaimStatus): Observable<Claim> {
        return this._httpClient.patch<Claim>(`${this.baseUrl}/${uuid}/status`, { status });
    }

    uploadAttachment(payload: FormData): Observable<any> {
        return this._httpClient.post(`${this.attachmentsUrl}/upload`, payload);
    }
    
    getAttachmentsByClaimId(uuid: string): Observable<any> {
        return this._httpClient.get(`${this.attachmentsUrl}/claim/${uuid}`);
    }
}
