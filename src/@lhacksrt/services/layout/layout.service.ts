import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../app/core/auth/auth.service';
import { AppConfig } from '../../../app/core/config/app.config';
import { AppConfigService } from '../config';
import { AppStylesConfig, Layout, Themes, Scheme, Theme } from './layout.types';
import { MediaWatcherService } from '../media-watcher';
import { Navigation, NavigationItem } from '../../components';

@Injectable({
    providedIn: 'root'
})
export class LayoutService {

    private _crumbs: BehaviorSubject<{ title: string; link: string; active?: boolean }[]> = new BehaviorSubject([] as { title: string; link: string; active?: boolean }[]);
    private _navigation: BehaviorSubject<Navigation> = new BehaviorSubject({} as Navigation);

    config!: AppStylesConfig;
    layout!: Layout;
    scheme!: 'dark' | 'light';
    theme!: string;
    themes!: Themes;
    show: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    private _isScreenSmall: boolean = false;

    constructor(
        private _router: Router,
        private _appConfigService: AppConfigService,
        private _mediaWatcherService: MediaWatcherService,
        private _authService: AuthService,
    ) {
        this.initialize();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ private properties
    // -----------------------------------------------------------------------------------------------------

    private initialize(): void {
  

        this._authService.check().subscribe({
            next: (res) => {
                if (res) {
                    this.show = true;
                }
            }
        });

        // Subscribe to config changes
        this._appConfigService.config$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config: AppConfig) => {
                // Store the config
                this.config = config;
            });

        this._mediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                // Check if the screen is small
                this._isScreenSmall = !matchingAliases.includes('md');
            });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    get isThinLayout(): boolean {
        return this.config.layout === 'thin';
    }

    get isClassyLayout(): boolean {
        return this.config.layout === 'classy';
    }


    get isScreenSmall(): boolean {
        return this._isScreenSmall;
    }

    get crumbs$(): Observable<{ title: string; link: string; active?: boolean }[]> {
        return this._crumbs.asObservable();
    }

    setCrumbs(crumbs: { title: string; link: string; active?: boolean }[]): void {
        this._crumbs.next(crumbs);
    }
    
    get navigation$(): Observable<Navigation> {
        return this._navigation.asObservable();
    }

    setNavigation(navigation: Navigation): void {

        this._navigation.next(navigation);
    }

    setLayout(layout: string): void {
        if (!this.isValidLayout(layout)) {
            console.error('Invalid layout:', layout);
            return;
        }

        // Clear the 'layout' query param to allow layout changes
        this._router.navigate([], {
            queryParams        : {
                layout: null
            },
            queryParamsHandling: 'merge'
        }).then(() => {
            // Set the config
            this._appConfigService.config = {layout};
        });
    }

    setPageTitle(title: string) {
        document.title = title;
    }

    switchLayout(): void {
        const currentLayout = this.config.layout;
        let newLayout: Layout;

        if (currentLayout === 'classy') {
            newLayout = 'thin';
        } else if (currentLayout === 'thin') {
            newLayout = 'classy';
        } else {
            newLayout = 'thin';
        }

        this.setLayout(newLayout);
    }

    setScheme(scheme: Scheme): void {
        if (!this.isValidScheme(scheme)) {
            console.error('Invalid scheme:', scheme);
            return;
        }
        this._appConfigService.config = {scheme};
    }

    setTheme(theme: Theme): void {
        if (!this.isValidTheme(theme)) {
            console.error('Invalid theme:', theme);
            return;
        }
        this._appConfigService.config = {theme};
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------


    private isValidLayout(layout: string): boolean {
        return ['default', 'empty', 'thin', 'classy'].includes(layout);
    }

    private isValidScheme(scheme: Scheme): boolean {
        return ['dark', 'light'].includes(scheme);
    }

    private isValidTheme(theme: Theme): boolean {
        return ['default', 'blue', 'green', 'red', 'purple', 'orange', 'pink'].includes(theme);
    }
}