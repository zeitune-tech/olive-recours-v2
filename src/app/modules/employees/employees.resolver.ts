import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { EmployeeService } from '@core/services/employee/employee.service';
import { forkJoin, map, Observable } from 'rxjs';

@Injectable({
    providedIn: "root"
})
export class EmployeesResolver implements Resolve<any> { 

    constructor(
        private _employeeService: EmployeeService
    ) { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        return forkJoin([
            this._employeeService.getEmployees(),
            this._employeeService.getRoles(),
            this._employeeService.getOperations()
        ])
    }
}