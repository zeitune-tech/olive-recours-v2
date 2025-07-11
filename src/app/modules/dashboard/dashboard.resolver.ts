import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { UserService } from '@core/services/user/user.service';
import { forkJoin, map, Observable } from 'rxjs';

@Injectable({
    providedIn: "root"
})
export class DashboardResolver implements Resolve<any> { 

    constructor(
        private _userService: UserService
    ) { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        return forkJoin([
            new Observable((observer) => {
                observer.next({
                    data: {
                        title: 'Dashboard'
                    }
                });
                observer.complete();
            }),
            this._userService.getManagementEntity()
        ])
    }
}