import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, EventEmitter, Output, ViewChild } from "@angular/core";
import { UntypedFormGroup, FormBuilder, Validators, UntypedFormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Permission } from "@core/services/profile/profile.interface";
import { ProfileService } from "@core/services/profile/profile.service";
import { TranslocoService } from "@jsverse/transloco";
import { animations } from "@lhacksrt/animations";
import { TableOptions, TableColumn } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-profiles-new-step-two",
    templateUrl: "./step-two.component.html",
    animations: animations
})
export class ProfilesNewStepTwoComponent {

    private _unsubscribeAll: Subject<any> = new Subject<any>();
        
    tableOptions: TableOptions<Permission> = {
        title: '',
        columns: [
            { label: 'profile.permissions.columns.name', property: 'name', type: 'text', visible: true },
            { label: 'profile.permissions.columns.description', property: 'description', type: 'text', visible: true },],
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [],
        renderItem: (element: Permission, property: keyof Permission) => {
            return element[property];
        },
    };
    data: Permission[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<Permission> = new MatTableDataSource();
    selection = new SelectionModel<Permission>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _profileService: ProfileService,
        private _translateService: TranslocoService,
        private formBuilder: FormBuilder
    ) { 
        this.formGroup = this.formBuilder.group({
            search: ['', Validators.required],
        });
    }

    
    @Output() formReady = new EventEmitter<UntypedFormGroup>();
    formGroup!: UntypedFormGroup;


    ngOnInit(): void {
        this._profileService.permissions$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: Permission[]) => {
            this.data = data;
            this.dataSource.data = data;
            this._changeDetectorRef.detectChanges();
        });
    }

    ngAfterViewInit() {
        if (this.dataSource) {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        }
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    preview() {
        console.log('preview');
    }

    get visibleColumns() {
        let columns: string[] = this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
        columns.push('checkbox');
        return columns;
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    masterToggle() {
        this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
    }

    toggleSelection(row: Permission) {
        this.selection.toggle(row);
    }


    trackByProperty(index: number, column: TableColumn<Permission>) {
        return column.property;
    }


    onNext(): void {
        this.formReady.emit(this.formGroup);
    }
}