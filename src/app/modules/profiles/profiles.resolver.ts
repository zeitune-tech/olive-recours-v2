import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { ClasseService } from '@core/services/classe/classe.service';
import { forkJoin, map, Observable } from 'rxjs';

@Injectable({
    providedIn: "root"
})
export class ProfilesResolver implements Resolve<any> { 

    constructor(
        private _classeService: ClasseService,
    ) { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        return this._classeService.getclassesAll();
    }
}