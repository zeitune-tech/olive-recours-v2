import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Company } from "@core/services/company/company.interface";
import { CompanyService } from "@core/services/company/company.service";
import { TranslocoService } from "@jsverse/transloco";
import { animations } from "@lhacksrt/animations";
import { TableColumn, TableOptions } from "@lhacksrt/components/table/table.interface";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-companies-list",
    templateUrl: "./list.component.html",
    animations: animations
})
export class CompaniesListComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any> = new Subject<any>();
        
    tableOptions: TableOptions<Company> = {
        title: '',
        columns: [
            { label: 'entities.company.table.columns.logo', property: 'logo', type: 'image', visible: true },
            { label: 'entities.company.table.columns.name', property: 'name', type: 'text', visible: true },
            { label: 'entities.company.table.columns.email', property: 'email', type: 'text', visible: true },
            { label: 'entities.company.table.columns.phone', property: 'phone', type: 'text', visible: true },
            { label: 'entities.company.table.columns.address', property: 'address', type: 'text', visible: true },
        ],
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [
            { label: 'entities.company.table.actions.edit', icon: 'edit', action: this.editItem.bind(this) },
            { label: 'entities.company.table.actions.delete', icon: 'delete', action: this.deleteItem.bind(this) },
            { label: 'entities.company.table.actions.attribute-attestation', icon: 'delete', action: this.attribute.bind(this) }
        ],
        imageOptions: {
            label: 'entities.company.table.columns.logo',
            property: 'logo',
            cssClasses: ['w-24 h-24']
        },
        renderItem: (element: Company, property: keyof Company) => {
            
            return element[property];
        },
    };
    data: Company[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<Company> = new MatTableDataSource();
    selection = new SelectionModel<Company>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    metadata: any;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _companyService: CompanyService,
        private _translateService: TranslocoService ,
    ) {}

    ngOnInit(): void {
        this._companyService.companies$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: Company[]) => {
            this.data = data;
            this.dataSource.data = data;
            this._changeDetectorRef.detectChanges();
        });
        this._companyService.metadata$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((metadata: any) => {
            this.metadata = metadata;
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

    attribute(item: Company | null): void {
       
    }

    /**
        * Edit Company Company
        */
    editItem(item: Company | null): void {
        
    }

    /**
        * Delete Company Company
        */
    deleteItem(item: Company): void {
        
    }

    get visibleColumns() {
        let columns: string[] = this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
        // columns.push('actions');
        return columns;
    }

    trackByProperty(index: number, column: TableColumn<Company>) {
        return column.property;
    }
}