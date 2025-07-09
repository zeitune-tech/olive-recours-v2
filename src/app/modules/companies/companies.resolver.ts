import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { CompanyService } from '@core/services/company/company.service';
import { forkJoin, map, Observable } from 'rxjs';

@Injectable({
    providedIn: "root"
})
export class CompaniesResolver implements Resolve<any> { 

    constructor(
        private _companyService: CompanyService,
    ) { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        return forkJoin([
            this._companyService.getCompanies(),
            this._companyService.getCompaniesAll()
        ])
    }
}