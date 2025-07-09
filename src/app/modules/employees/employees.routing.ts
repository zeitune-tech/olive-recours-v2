import { Routes } from "@angular/router";
import { EmployeesListComponent } from "./list/list.component";
import { EmployeesNewComponent } from "./new/new.component";

export const routes: Routes = [
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    { path: 'list', component: EmployeesListComponent },
    { path: 'new', component: EmployeesNewComponent }
]
