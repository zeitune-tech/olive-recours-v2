import { Component, Input, Output, ViewChild } from "@angular/core";
import { TableActions, TableColumn, TableOptions, TablePropertyOptions } from "./table.interface";
import { SelectionModel } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { TableService } from "./table.service";
import { animations } from "../../animations";
import { UntypedFormControl } from "@angular/forms";


@Component({
    selector: 'template-table',
    templateUrl: './table.component.html',
    animations: animations
})
export class TableComponent {

    @Input() type: 'default' 
        | 'pointages-daily' 
        | 'pointages-weekly' 
        | 'pointages-monthly-total'
        | 'pointages-monthly-by-day'
        | 'pointages-monthly-by-week'= 'default';

    @Input() tableOptions: TableOptions<any> = {
        title: '',
        columns: [], actions: [],
        pageSize: 10,
        pageSizeOptions: [5, 10, 20, 50],
        imageOptions: { label: '', property: '', cssClasses: [] },
        renderItem: (element: any, property: any) => {
            return element[property];
        }
    }

    daysInMonth: Date[] = [];

    @Input() data: any[] = [];

    dataSource: MatTableDataSource<any>= new MatTableDataSource<any>([]);
    @Output() selection: SelectionModel<any> = new SelectionModel<any>(true, []);
    @Input() searchCtrl = new UntypedFormControl();

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private _tableService: TableService<any>
    ) {}

    ngOnInit() {
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.searchCtrl.valueChanges.subscribe(value => this.onFilterChange(value));
        this.daysInMonth = this._tableService.getDaysInMonth(2024, 11);
    }

    ngAfterViewInit() {
        if (this.dataSource) {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
    }


    get visibleColumns() {
        return this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
    }
    
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this._tableService.onFilterChange(filterValue, this.dataSource);
    }

    onFilterChange(value: string) {
        if (!this.dataSource) {
          return;
        }
        value = value.trim();
        value = value.toLowerCase();
        this.dataSource.filter = value;
    }

    toggleColumnVisibility(column: TableColumn<any>, event: Event) {
        this._tableService.toggleColumnVisibility(column, event);
    }

    isAllSelected() {
        return this._tableService.isAllSelected(this.dataSource, this.selection);
    }

    masterToggle() {
        this._tableService.masterToggle(this.dataSource, this.selection);
    }

    trackByProperty(index: number, column: TableColumn<any>) {
        return column.property;
    }
}