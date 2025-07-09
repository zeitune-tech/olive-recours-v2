import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { MatSelectChange } from "@angular/material/select";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { BehaviorSubject, combineLatest, Subject} from "rxjs";
import { GridListService } from './grid-list.service';
import { GridListOptions } from "./grid-list.interface";
import { UntypedFormControl } from "@angular/forms";


@Component({
    selector: 'template-grid-list',
    templateUrl: './grid-list.component.html'
})
export class GridListComponent {
    
    filters: {
        optionKey$: BehaviorSubject<string>;
        query$: BehaviorSubject<string>;
        hideCompleted$: BehaviorSubject<boolean>;
    } = {
        optionKey$ : new BehaviorSubject('all'),
        query$        : new BehaviorSubject(''),
        hideCompleted$: new BehaviorSubject(false)
    };

    @Input() gridListOptions: GridListOptions<any> = {
        filterOptions: [],
        filterOptionAccessor: { key: "id", label: "name" },
        itemOptions: []
    };

    @Input() data: any[] = [];
    filteredItems: any[] = [];
    searchCtrl = new UntypedFormControl();

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _gridListService: GridListService
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {

        combineLatest([this.filters.optionKey$, this.filters.query$, this.filters.hideCompleted$])
        .subscribe(([optionKey, query, hideCompleted]) => {
            this.filteredItems = this.data
        })
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------


    filterByQuery(query: string): void {
        this.filters.query$.next(query);
    }


    filter(change: any): void {
        this.filters.optionKey$.next(change.value);
    }


    toggleCompleted(change: MatSlideToggleChange): void {
        this.filters.hideCompleted$.next(change.checked);
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
