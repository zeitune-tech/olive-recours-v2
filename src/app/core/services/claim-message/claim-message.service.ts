import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ClaimMessage } from "./claim-message.interface";
import { environment } from "@env/environment";

@Injectable({
    providedIn: 'root'
})
export class ClaimMessageService {

    private baseUrl = environment.base_url + '/app/claim-messages';

    constructor(private _httpClient: HttpClient) {}

    getByClaimUuid(claimUuid: string): Observable<ClaimMessage[]> {
        return this._httpClient.get<ClaimMessage[]>(`${this.baseUrl}/claim/${claimUuid}`);
    }

    create(message: Partial<ClaimMessage>): Observable<ClaimMessage> {
        return this._httpClient.post<ClaimMessage>(`${this.baseUrl}`, message);
    }
}
