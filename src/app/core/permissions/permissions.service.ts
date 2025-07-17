import { Injectable } from "@angular/core";
import { UserService } from "../services/user/user.service";
import { map, Observable, of } from "rxjs";
import { User } from "../services/user/user.interface";


@Injectable({
    providedIn: 'root'
})
export class PermissionsService {

    constructor(
        private _userService: UserService,
    ) { }


    public hasPermission(user: User, requiredPermission: string | string[]): boolean {
        // Check if the user has the required role
        const permissions = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission];
        const hasRole = permissions.some(permission => user.permissions.includes(permission));

        // For this implementation, we don't need to check userIds
        // since we're only checking roles
        return hasRole;
    }

    // Vérifie les permissions de manière asynchrone (utile pour les guards)
    hasPermissionAsync(requiredPermissions: string | string[], mode: 'all' | 'any' = 'all'): Observable<boolean> {
        return this._userService.permissions$.pipe(
            map((permissions: string[]) => {
                const required = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
                return mode === 'all'
                    ? required.every(perm => permissions.includes(perm))
                    : required.some(perm => permissions.includes(perm));
            })
        );
    }


    public checkDirectly(permission: string): boolean {
        const user = this._userService.user;
        if (!user || !user.permissions) {
            console.warn('User data is unavailable');
            return false;
        }
        return this.hasPermission(user, permission);
    }
    /**
     * Check permissions
     * 
     * @param permission - The permission to check
     * @param userIds - The user IDs to check
     * @returns Observable<boolean>
     */
    check(permission: string): Observable<boolean> {

        return this._userService.get().pipe(
            map(user => {
                if (!user || !user.permissions) {
                    console.warn('User data is unavailable');
                    return false;
                }
                return this.hasPermission(user, permission);
            })
        );
    }

    checkMany(permissions: string[]): Observable<boolean> {

        return this._userService.get().pipe(
            map(user => {
                if (!user || !user.permissions) {
                    console.warn('User data is unavailable');
                    return false;
                }
                return permissions.every(permission => this.hasPermission(user, permission));
            })
        );
    }
}