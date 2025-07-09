import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TranslocoLoader, Translation } from '@jsverse/transloco';

@Injectable({
    providedIn: 'root'
})
export class TranslocoHttpLoader implements TranslocoLoader {

    constructor(
        private _httpClient: HttpClient)
    { }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    getTranslation(lang: string): Observable<Translation> {
        return this._httpClient.get<Translation>(`./assets/i18n/${lang}.json`);
    }
}
