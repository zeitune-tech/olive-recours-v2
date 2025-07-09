import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { UserService } from '@core/services/user/user.service';
import { NavigationService } from '@core/navigation/navigation.service';
import { CompanyService } from '@core/services/company/company.service';
import { ClaimService } from '@core/services/claim/claim.service';

@Injectable({
    providedIn: 'root'
})
export class InitialDataResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(
        private _userService: UserService,
        private _navigationService: NavigationService,
        private _companyService: CompanyService,
        private _claimService: ClaimService
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Use this resolver to resolve initial mock-api for the application
     *
     * @param route
     * @param state
     */
    resolve(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot
    ): Observable<any> {
        // Fork join multiple API endpoint calls to wait all of them to finish


        return forkJoin([
            this._navigationService.get(),
            this._userService.get(),
            this._companyService.getMyCompany(),
            this._companyService.getCompaniesAll(),
            this._claimService.getAll()
        ])
    }

    
}
