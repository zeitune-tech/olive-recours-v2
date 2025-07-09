import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IsActiveMatchOptions, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { VerticalNavigationComponent } from '../../vertical.component';
import { AppNavigationService } from '../../../navigation.service';
import { NavigationItem } from '../../../navigation.types';
import { UtilsService } from '../../../../../services/utils';

@Component({
    selector       : 'vertical-navigation-basic-item',
    templateUrl    : './basic.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerticalNavigationBasicItemComponent implements OnInit, OnDestroy
{
    @Input() item!: NavigationItem;
    @Input() name!: string;

    isActiveMatchOptions: IsActiveMatchOptions;
    private _verticalNavigationComponent!: VerticalNavigationComponent;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _navigationService: AppNavigationService,
        private utilsService: UtilsService
    )
    {
        // Set the equivalent of {exact: false} as default for active match options.
        // We are not assigning the item.isActiveMatchOptions directly to the
        // [routerLinkActiveOptions] because if it's "undefined" initially, the router
        // will throw an error and stop working.
        this.isActiveMatchOptions = this.utilsService.subsetMatchOptions;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Set the "isActiveMatchOptions" either from item's
        // "isActiveMatchOptions" or the equivalent form of
        // item's "exactMatch" option
        this.isActiveMatchOptions =
            this.item.isActiveMatchOptions ?? this.item.exactMatch
                ? this.utilsService.exactMatchOptions
                : this.utilsService.subsetMatchOptions;

        // Get the parent navigation component
        this._verticalNavigationComponent = this._navigationService.getComponent(this.name);

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Subscribe to onRefreshed on the navigation component
        this._verticalNavigationComponent.onRefreshed.pipe(
            takeUntil(this._unsubscribeAll)
        ).subscribe(() => {

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
