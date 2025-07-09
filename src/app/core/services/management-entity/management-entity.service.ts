import { Injectable } from "@angular/core";
import { Observable, ReplaySubject, tap } from "rxjs";
import { ManagementEntity } from "./management-entity.interface";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class ManagementEntityService {

    baseUrl = environment.request_url;

    private _entity: ReplaySubject<ManagementEntity> = new ReplaySubject<ManagementEntity>(1);
    
    constructor(
        private _httpClient: HttpClient
    ) { }

    set entity(value: ManagementEntity) {
        this._entity.next(value);
    }

    get entity$() {
        return this._entity.asObservable();
    }

    create(entity: ManagementEntity): Observable<ManagementEntity> {
        return this._httpClient.post<ManagementEntity>(`${this.baseUrl}/management-entities`, entity)
        .pipe(
            tap((entity) => {
                this.entity = entity;
            })
        );
    }

    getEntity(id: string): Observable<ManagementEntity> {
        return this._httpClient.get<ManagementEntity>(`${this.baseUrl}/management-entities/${id}`)
        .pipe(
            tap((entity) => {
                this.entity = entity;
            })
        );
    }

    get(): Observable<ManagementEntity> {
        return this._httpClient.get<ManagementEntity>(`${this.baseUrl}/management-entities/me`)
        .pipe(
            tap((entity) => {
                this.entity = entity;
            })
        );
    }
}