import { Injectable,  } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanMatch, GuardResult, MaybeAsync, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '@core/services/user/user.service';

@Injectable({
    providedIn: 'root'
})
export class HasEntityGuard implements CanActivate, CanActivateChild, CanMatch {
    /**
     * Constructor
     */
    constructor(
        private _userService: UserService,
        private _router: Router
    ) {  }

    
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    

    canMatch(
        route: Route, 
        segments: UrlSegment[]
    ): MaybeAsync<GuardResult> {


        return this._check('/');
    }
   
    canActivate(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
        return this._check(redirectUrl);
    }

    canActivateChild(
        childRoute: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
        return this._check(redirectUrl);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    private _check(redirectURL: string): Observable<boolean>  {
        // Check the authentication status

        return this._userService.hasEntity()
        .pipe(
            switchMap((authenticated) => {
                // If the user is not authenticated...
                if ( !authenticated ) {
                    // Redirect to the sign-in page
                    this._router.navigate(['complete-registration'], {queryParams: {redirectURL}});

                    // Prevent the access
                    return of(false);
                }

                // Allow the access
                return of(true);
            })
        );
    }
}
