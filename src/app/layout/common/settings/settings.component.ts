import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { AppConfigService } from '../../../../@lhacksrt/services/config';
import { AppStylesConfig, Layout, Scheme, Theme, Themes } from '../../../../@lhacksrt/services/layout/layout.types';
import { AppConfig } from '../../../core/config/app.config';

@Component({
    selector     : 'settings',
    templateUrl  : './settings.component.html',
    styles       : [
        `
            settings {
                position: static;
                display: block;
                flex: none;
                width: auto;
            }
        `
    ],
    encapsulation: ViewEncapsulation.None,
})
export class SettingsComponent implements OnInit, OnDestroy {
    config!: AppStylesConfig;
    layout!: Layout;
    scheme!: 'dark' | 'light';
    theme!: string;
    themes!: Themes;
    show: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _router: Router,
        private _appConfigService: AppConfigService,
        private _authService: AuthService
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {
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
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    setLayout(layout: string): void {
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

    setScheme(scheme: Scheme): void {
        this._appConfigService.config = {scheme};
    }

    setTheme(theme: Theme): void {
        this._appConfigService.config = {theme};
    }
}
