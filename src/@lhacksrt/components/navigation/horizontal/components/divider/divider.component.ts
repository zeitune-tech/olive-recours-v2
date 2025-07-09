import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AppNavigationService } from '../../../navigation.service';
import { NavigationItem } from '../../../navigation.types';
import { HorizontalNavigationComponent } from '../../horizontal.component';

@Component({
    selector       : 'horizontal-navigation-divider-item',
    templateUrl    : './divider.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HorizontalNavigationDividerItemComponent implements OnInit, OnDestroy
{
    @Input() item!: NavigationItem;
    @Input() name!: string;

    private _horizontalNavigationComponent!: HorizontalNavigationComponent;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _havigationService: AppNavigationService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Get the parent navigation component
        this._horizontalNavigationComponent = this._havigationService.getComponent(this.name);

        // Subscribe to onRefreshed on the navigation component
        this._horizontalNavigationComponent.onRefreshed.pipe(
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
