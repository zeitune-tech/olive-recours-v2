import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from './user/user.service';
import { ManagementEntityService } from './management-entity/management-entity.service';
import { CompanyService } from './company/company.service';
import { EmployeeService } from './employee/employee.service';

@NgModule({
    imports: [
        CommonModule
    ],
    providers: [
        UserService,
        ManagementEntityService,
        CompanyService,
        EmployeeService,
    ]
})
export class ServicesModule { }