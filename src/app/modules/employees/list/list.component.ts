    import { SelectionModel } from "@angular/cdk/collections";
    import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
    import { UntypedFormControl } from "@angular/forms";
    import { MatDialog } from "@angular/material/dialog";
    import { MatPaginator } from "@angular/material/paginator";
    import { MatSort } from "@angular/material/sort";
    import { MatTableDataSource } from "@angular/material/table";
    import { Employee } from "@core/services/employee/employee.inteface";
    import { EmployeeService } from "@core/services/employee/employee.service";
    import { TableColumn, TableOptions } from "@lhacksrt/components/table/table.interface";
    import { Subject, takeUntil } from "rxjs";

    @Component({
        selector: "app-employees-list",
        templateUrl: "./list.component.html",
    })
    export class EmployeesListComponent {
    
    private _unsubscribeAll: Subject<any> = new Subject<any>();
        
    tableOptions: TableOptions<Employee> = {
        title: '',
        columns: [
            { label: 'employee.columns.first-name', property: 'firstName', type: 'text', visible: true },
            { label: 'employee.columns.last-name', property: 'lastName', type: 'text', visible: true },
            { label: 'employee.columns.email', property: 'email', type: 'text', visible: true },
            { label: 'employee.columns.management-entity', property: 'managementEntity', type: 'text', visible: true },
        ],
        pageSize: 8,
        pageSizeOptions: [5, 6, 8],
        actions: [
            { label: 'employee.actions.edit', icon: 'edit', action: this.editItem.bind(this) },
            { label: 'employee.actions.delete', icon: 'delete', action: this.deleteItem.bind(this) }
        ],
        renderItem: (element: Employee, property: keyof Employee) => {
            
            if (property === 'managementEntity') {
                return element.managementEntity?.name;
            }
            return element[property];
        },
    };
    data: Employee[] = [];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource: MatTableDataSource<Employee> = new MatTableDataSource();
    selection = new SelectionModel<Employee>(true, []);
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _employeeService: EmployeeService,
        private _dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this._employeeService.employees$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: Employee[]) => {
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

    /**
        * Edit Employee Employee
        */
    editItem(item: Employee | null): void {
        
    }

    /**
        * Delete Employee Employee
        */
    deleteItem(item: Employee): void {
        
    }
    
    get visibleColumns() {
        const columns:string[] = this.tableOptions.columns.filter(column => column.visible).map(column => column.property);
        columns.push('actions');
        return columns;
    }

    trackByProperty(index: number, column: TableColumn<Employee>) {
        return column.property;
    }
}