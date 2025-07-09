import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { merge } from 'lodash-es';
import { APP_TEMPLATE_CONFIG } from './config.constants';

@Injectable({
    providedIn: 'root'
})
export class AppConfigService {

    private _config: BehaviorSubject<any>;

    constructor(@Inject(APP_TEMPLATE_CONFIG) config: any) {
        // Private
        this._config = new BehaviorSubject(config);
    }

    set config(value: any) {
        // Merge the new config over to the current config
        const config = merge({}, this._config.getValue(), value);
        // Execute the observable
        this._config.next(config);
    }

    get config$(): Observable<any> {
        return this._config.asObservable();
    }


    reset(): void  {
        // Set the config
        this._config.next(this.config);
    }
}
