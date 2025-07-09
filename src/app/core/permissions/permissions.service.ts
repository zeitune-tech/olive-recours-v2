import { Injectable } from "@angular/core";
import { UserService } from "../services/user/user.service";
import { map, Observable, of} from "rxjs";
import { User } from "../services/user/user.interface";


@Injectable({
    providedIn: 'root'
})
export class PermissionsService {

    constructor(
        private _userService: UserService,
    ) { }
   

    public hasPermission (user: User, requiredPermission: string): boolean {
        // Check if the user has the required role
        const hasRole = user.permissions.includes(requiredPermission);

        // For this implementation, we don't need to check userIds
        // since we're only checking roles
        return hasRole;
    }


    public checkDirectly(permission: string): boolean {
        const user = this._userService.user;
        if (!user || !user.permissions) {
            console.warn('User data is unavailable');
            return false;
        }
        return this.hasPermission(user, permission);
        return true;
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
        return of(true);
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
        return of(true);
    }
}