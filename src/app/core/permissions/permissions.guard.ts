import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserService } from '@core/services/user/user.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { PermissionsService } from './permissions.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
  constructor(
    private router: Router,
    private permissionsService: PermissionsService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    const requiredPermissions = route.data['permissions'] as string | string[];
    const mode = (route.data['permissionMode'] as 'all' | 'any') || 'all';

    if (!requiredPermissions) {
      return true; // Pas de permissions requises, accès autorisé
    }

    return this.permissionsService.hasPermissionAsync(requiredPermissions, mode).pipe(
      map(hasAccess => {
        if (!hasAccess) {
          // Rediriger vers une page non autorisée ou la page d'accueil
          this.router.navigate(['/error/unauthorized']);
          return false;
        }
        return true;
      }),
      catchError(() => {
        this.router.navigate(['/error/unauthorized']);
        return of(false);
      })
    );
  }
}