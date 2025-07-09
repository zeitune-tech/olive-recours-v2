import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Attachment } from "./attachment.interface";
import { environment } from "@env/environment";

@Injectable({
    providedIn: 'root'
})
export class AttachmentService {

    private baseUrl = environment.base_url + '/app/attachments';

    constructor(private _httpClient: HttpClient) {}

    getByClaimUuid(claimUuid: string): Observable<Attachment[]> {
        return this._httpClient.get<Attachment[]>(`${this.baseUrl}/claim/${claimUuid}`);
    }

    uploadAttachment(claimUuid: string, file: File, name: string, description: string): Observable<Attachment> {
        const formData = new FormData();
        formData.append("claimId", claimUuid);
        formData.append("file", file);
        formData.append("name", name);
        formData.append("description", description);

        return this._httpClient.post<Attachment>(`${this.baseUrl}/upload`, formData);
    }

    delete(uuid: string): Observable<void> {
        return this._httpClient.delete<void>(`${this.baseUrl}/${uuid}`);
    }

    download(uuid: string): Observable<Blob> {
        return this._httpClient.get(`${this.baseUrl}/download/${uuid}`, {
            responseType: 'blob'
        });
    }
}
