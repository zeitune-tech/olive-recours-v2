import { Component, Inject, OnDestroy, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { combineLatest, filter, map, Subject, takeUntil } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { MediaWatcherService } from '../../@lhacksrt/services/media-watcher/media-watcher.service';
import { TEMPLATE_VERSION } from '../../@lhacksrt/version/template-version';
import { AppConfigService } from '../../@lhacksrt/services/config';
import { AppStylesConfig, Layout } from '../../@lhacksrt/services/layout/layout.types';
import { PermissionsService } from '../core/permissions/permissions.service';

@Component({
    selector     : 'layout',
    templateUrl  : './layout.component.html',
    styleUrls    : ['./layout.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LayoutComponent implements OnInit, OnDestroy {

    config!: AppStylesConfig;
    layout!: Layout;
    scheme!: 'dark' | 'light';
    theme!: string;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    showSwitcher = false;
    currentPanel: {
        name: string;
        icon: string;
    } = {} as any;

    panels: {name:string, icon:string, route: string}[] = [
        {
            name: 'Office',
            icon: 'fluent:edit-settings',
            route: 'office'
        },
        {
            name: 'Page de saisie',
            icon: 'fluent:people-team',
            route: 'services'
        },
    ]

    permissions: any = {
        ADMIN_SPACE: false
    }
    
    constructor(
        @Inject(DOCUMENT) private _document: any,
        private _activatedRoute: ActivatedRoute,
        private _appConfigService: AppConfigService,
        private _renderer2: Renderer2,
        private _router: Router,
        private _mediaWatcherService: MediaWatcherService,
        private _permissionsService: PermissionsService
    ) {
        // get current panel on route
        const currentPanel = this._router.url.split('/')[1];
        
        // set current panel
        if ( currentPanel === 'office' ) {
            this.currentPanel = this.panels[0];
        } else {
            this.currentPanel = this.panels[1];
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {

        // Check permission
        this.checkPermission();

        // if current route is not pre-admin or app, set showSwitcher to false
        if ( !this._router.url.includes("/office") && !this._router.url.includes("/app") ) { 
            this.showSwitcher = false;
        } else {
            this.showSwitcher = true;
        }
        
        // Set the theme and scheme based on the configuration
        combineLatest([
            this._appConfigService.config$,
            this._mediaWatcherService.onMediaQueryChange$(['(prefers-color-scheme: dark)', '(prefers-color-scheme: light)'])
        ]).pipe(
            takeUntil(this._unsubscribeAll),
            map(([config, mql]) => {

                const options = {
                    scheme: config.scheme,
                    theme : config.theme
                };

                // If the scheme is set to 'auto'...
                if ( config.scheme === 'auto' ) {
                    // Decide the scheme using the media query
                    options.scheme = mql?.breakpoints['(prefers-color-scheme: dark)'] ? 'dark' : 'light';
                }

                return options;
            })
        ).subscribe((options) => {

            // Store the options
            this.scheme = options.scheme;
            this.theme = options.theme;

            // Update the scheme and theme
            this._updateScheme();
            this._updateTheme();
        });

        // Subscribe to config changes
        this._appConfigService.config$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config: AppStylesConfig) => {

                // Store the config
                this.config = config;

                // Update the layout
                this._updateLayout();
            });

        // Subscribe to NavigationEnd event
        this._router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            takeUntil(this._unsubscribeAll)
        ).subscribe(() => {

            // Update the layout
            this._updateLayout();
        });

        // Set the app version
        this._renderer2.setAttribute(this._document.querySelector('[ng-version]'), 'version', TEMPLATE_VERSION);
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    switchPanel(panel: {name: string, icon: string, route: string}): void {
        this.currentPanel = panel;
        this._router.navigate([panel.route]);
    }

    checkPermission() {
        this._permissionsService.check('ADMIN').subscribe((res) => {
            this.permissions.ADMIN_SPACE = res;
        });
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    private _updateLayout(): void {
        // Get the current activated route
        let route = this._activatedRoute;
        while ( route.firstChild ) {
            route = route.firstChild;
        }

        // 1. Set the layout from the config
        this.layout = this.config.layout;

        const layoutFromQueryParam = (route.snapshot.queryParamMap.get('layout') as Layout);
        if ( layoutFromQueryParam ) {
            this.layout = layoutFromQueryParam;
            if ( this.config )  {
                this.config.layout = layoutFromQueryParam;
            }
        }

        const paths = route.pathFromRoot;
        paths.forEach((path) => {

            // Check if there is a 'layout' data
            if ( path.routeConfig && path.routeConfig.data && path.routeConfig.data['layout'] ) {
                // Set the layout
                this.layout = path.routeConfig.data['layout'];
            }
        });
    }
    
    private _updateScheme(): void {
        // Remove class names for all schemes
        this._document.body.classList.remove('light', 'dark');
        // Add class name for the currently selected scheme
        this._document.body.classList.add(this.scheme);
    }

    private _updateTheme(): void {
       // Find the class name for the previously selected theme and remove it
       this._document.body.classList.forEach((className: string) => {
            if ( className.startsWith('theme-') ) {
                this._document.body.classList.remove(className, className.split('-')[1]);
            }
        });
        // Add class name for the currently selected theme
        this._document.body.classList.add(this.theme);
    }
}

