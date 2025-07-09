import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AppNavigationService } from '../../../../../@lhacksrt/components';
import { MediaWatcherService } from '../../../../../@lhacksrt/services/media-watcher/media-watcher.service';
import { UserService } from '../../../../core/services/user/user.service';
import { VerticalNavigationComponent } from '../../../../../@lhacksrt/components/navigation/vertical/vertical.component';
import { Navigation } from '../../../../core/navigation/navigation.types';
import { LayoutService } from '../../../../../@lhacksrt/services/layout/layout.service';
import { User } from '../../../../core/services/user/user.interface';

@Component({
    selector     : 'classy-layout',
    templateUrl  : './classy.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class ClassyLayoutComponent implements OnInit, OnDestroy {
    
    isScreenSmall!: boolean;
    navigation!: Navigation;
    user!: User;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _userService: UserService,
        private _layoutService: LayoutService,
        private _mediaWatcherService: MediaWatcherService,
        private _appNavigationService: AppNavigationService,
    ) { }


    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    get currentYear(): number {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {
        // Subscribe to navigation data
        this._layoutService.navigation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((navigation: Navigation) => {
                this.navigation = navigation;
            });

        // Subscribe to the user service
        this._userService.user$
            .pipe((takeUntil(this._unsubscribeAll)))
            .subscribe((user: User) => {
                this.user = user;
            });

        // Subscribe to media changes
        this._mediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    toggleNavigation(name: string): void {
        // Get the navigation
        const navigation = this._appNavigationService.getComponent<VerticalNavigationComponent>(name);

        if ( navigation ) {
            // Toggle the opened status
            navigation.toggle();
        }
    }
}
