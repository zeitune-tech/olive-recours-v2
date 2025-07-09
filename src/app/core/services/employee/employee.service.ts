import { Injectable } from "@angular/core";
import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { Employee, Operation, Role } from "./employee.inteface";

@Injectable()
export class EmployeeService {
    
    baseUrl = environment.request_url;
    private _employee: ReplaySubject<Employee> = new ReplaySubject<Employee>(1);
    private _employees: ReplaySubject<Employee[]> = new ReplaySubject<Employee[]>(1);

    private _roles: ReplaySubject<Role[]> = new ReplaySubject<Role[]>(1);
    private _operations: ReplaySubject<Operation[]> = new ReplaySubject<Operation[]>(1);

    set employee(value: Employee) {
        this._employee.next(value);
    }

    get employee$() {
        return this._employee.asObservable();
    }

    set employees(value: Employee[]) {
        this._employees.next(value);
    }

    get employees$() {
        return this._employees.asObservable();
    }

    set roles(value: Role[]) {
        this._roles.next(value);
    }

    get roles$() {
        return this._roles.asObservable();
    }

    set operations(value: Operation[]) {
        this._operations.next(value);
    }

    get operations$() {
        return this._operations.asObservable();
    }

    constructor(
        private _httpClient: HttpClient
    ) { }

    create(employee: any): Observable<Employee> {
        return this._httpClient.post<Employee>(`${this.baseUrl}/employees`, employee)
        .pipe(
            tap((employee) => {
                this.employee = employee;
                return (employee);
            }),
            catchError(() => of({} as Employee))
        );
    }

    getEmployees(): Observable<Employee[]> {
        return this._httpClient.get<Employee[]>(`${this.baseUrl}/employees`)
        .pipe(
            tap((employees) => {
                this.employees = employees;
                return (employees);
            }),
            catchError(() => of([] as Employee[]))
        );
    }

    getEmployee(id: number): Observable<Employee> {
        return this._httpClient.get<Employee>(`${this.baseUrl}/employees/${id}`)
        .pipe(
            tap((employee) => {
                this.employee = employee;
                return (employee);
            }),
            catchError(() => of({} as Employee))
        );
    }

    createRole(role: Role): Observable<Role> {
        return this._httpClient.post<Role>(`${this.baseUrl}/roles`, role)
        .pipe(
            tap((role) => {
                return (role);
            }),
            catchError(() => of({} as Role))
        );
    }

    getRoles(): Observable<Role[]> {
        return this._httpClient.get<Role[]>(`${this.baseUrl}/roles`)
        .pipe(
            tap((roles) => {
                this.roles = roles;
                return (roles);
            }),
            catchError(() => of([] as Role[]))
        );
    }

    getOperations(): Observable<Operation[]> {
        return this._httpClient.get<Operation[]>(`${this.baseUrl}/operations`)
        .pipe(
            tap((operations) => {
                this.operations = operations;
                return (operations);
            }),
            catchError(() => of([] as Operation[]))
        );
    }
}