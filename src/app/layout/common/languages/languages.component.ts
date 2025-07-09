import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslocoService, LangDefinition, AvailableLangs } from '@jsverse/transloco';
import { take } from 'rxjs';
import { AppNavigationService } from '../../../../@lhacksrt/components';
import { VerticalNavigationComponent } from '../../../../@lhacksrt/components/navigation/vertical/vertical.component';

@Component({
    selector       : 'languages',
    templateUrl    : './languages.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs       : 'languages'
})
export class LanguagesComponent implements OnInit, OnDestroy {

    availableLangs: AvailableLangs = [
        {
            id   : 'en',
            label: 'English',
        },
        {
            id   : 'fr',
            label: 'French',
        },
        {
            id   : 'sn',
            label: 'Wolof',
        },
        {
            id   : 'ar',
            label: 'Arabic',
        }
    ];

    langs: any = [
        {
            id   : 'en',
            label: 'English',
            flag : 'us'
        },
        {
            id   : 'fr',
            label: 'French',
            flag : 'fr'
        },
        {
            id   : 'sn',
            label: 'Wolof',
            flag : 'sn'
        },
        {
            id   : 'ar',
            label: 'Arabic',
            flag : 'sa'
        }
    ];
    activeLang: string = 'fr';
    flagCodes: any;

    
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _appNavigationService: AppNavigationService,
        private _translocoService: TranslocoService
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the available languages from transloco
        this.availableLangs = this._translocoService.getAvailableLangs();

        // Subscribe to language changes
        this._translocoService.langChanges$.subscribe((activeLang) => {

            // Get the active lang
            this.activeLang = activeLang;

            // Update the navigation
            this._updateNavigation(activeLang);
        });

        // Set the country iso codes for languages for flags
        this.flagCodes = {
            'en': 'us',
            'fr': 'fr',
            'sn': 'sn',
            'ar': 'sa'
        };
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    getLabel(lang: string | LangDefinition): string {
        return this.langs.find((l: any) => l.id === lang).label;
    }

    /**
     * Set the active lang
     *
     * @param lang
     */
    setActiveLang(lang: any): void {
        // Set the active lang
        this._translocoService.setActiveLang(lang);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Update the navigation
     *
     * @param lang
     * @private
     */
    private _updateNavigation(lang: string): void {
        // For the demonstration purposes, we will only update the Dashboard names
        // from the navigation but you can do a full swap and change the entire
        // navigation data.
        //
        // You can import the data from a file or request it from your backend,
        // it's up to you.

        // Get the component -> navigation data -> item
        const navComponent = this._appNavigationService.getComponent<VerticalNavigationComponent>('mainNavigation');

        // Return if the navigation component does not exist
        if ( !navComponent ) {
            return;
        }

        // Get the flat navigation data
        const navigation = navComponent.navigation;

    
        // Refresh the navigation component
        navComponent.refresh();
    }
}
