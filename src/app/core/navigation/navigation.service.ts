import { Injectable } from '@angular/core';
import { filter, forkJoin, map, Observable, of, ReplaySubject, Subject, take, takeUntil, tap } from 'rxjs';
import { cloneDeep } from 'lodash-es';
import { Navigation } from './navigation.types';
import { compactNavigation, defaultNavigation } from './data';
import { LayoutService } from '../../../@lhacksrt/services/layout/layout.service';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { UserService } from '@core/services/user/user.service';
import { PermissionsService } from '@core/permissions/permissions.service';
import { NavigationItem } from '@lhacksrt/components';
import { User } from '@core/services/user/user.interface';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    private destroy$ = new Subject<void>();

    private items: Navigation = {
        compact: compactNavigation,
        default: defaultNavigation,
    } as Navigation;

    
    private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);

    constructor(
        private _layoutService: LayoutService,
        private _router: Router,
        private _permissionsService: PermissionsService,
        private _userService: UserService
    ) {

        // this._userService.user$.subscribe(
        //     (user: User) => {
        //         this.items.default = this.checkPermissions(user, this.items.default);
        //         this.items.compact = this.checkPermissions(user, this.items.compact);
        //         this._navigation.next(this.items);
        //     }
        // );

        this._navigation.next(this.items);

        this._router.events
        .pipe(
            filter((event) => event instanceof NavigationEnd),
            takeUntil(this.destroy$)
        ).subscribe(() => {
            this._layoutService.setNavigation(this.fillChildren(this.items));
        });
    }


    private checkPermissions(user: User, navigation: NavigationItem[]): NavigationItem[] {
        navigation.forEach(item => {
            if (item.permission) {
                item.hidden = () => !this._permissionsService.hasPermission(user, item.permission as string);
                item.children?.forEach(child => {
                    if (child.permission) {
                        child.hidden = () => !this._permissionsService.hasPermission(user, child.permission as string);
                    }
                });
            } else {
                item.hidden = () => false;
            }
        });
        return navigation;
    }


    private getCurrentRoute(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot | null {
        if (route.firstChild) {
          return this.getCurrentRoute(route.firstChild);
        }
        return route;
    }


    private fillChildren(navigation: Navigation): Navigation {
        navigation.compact.forEach((compactNavItem) => {
            navigation.default.forEach((defaultNavItem) => {
                if (defaultNavItem.id === compactNavItem.id) {
                    compactNavItem.children = cloneDeep(defaultNavItem.children);
                }
            });
        });

        return navigation;
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    get navigation$(): Observable<Navigation> {
        return this._navigation.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------


    get(): Observable<Navigation> {
        return of(this.items).pipe(
            tap((navigation) => {
                this._navigation.next(navigation);
            })
        );
    }


    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
