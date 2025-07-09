import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { PermissionsService } from './permissions.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionsGuard implements CanActivate, CanActivateChild {
  constructor(
    private _permissionsService: PermissionsService,
    private _router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const permission = route.data['permission'];
    const redirectRoute = route.data['redirectRoute'] || '/';

    return this._permissionsService.check(permission).pipe(
        switchMap((hasPermission) => {
            if (!hasPermission) {
                this._router.navigate([redirectRoute]);
                return of(false);
            }
            return of(true);
        })
    );
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.canActivate(childRoute, state);
  }
}
