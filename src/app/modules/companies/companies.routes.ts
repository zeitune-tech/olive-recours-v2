import { Routes } from "@angular/router";
import { CompanyNewComponent } from "./new/new.component";
import { CompaniesListComponent } from "./list/list.component";

export const routes: Routes = [
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    { path: 'new', component: CompanyNewComponent},
    { path: 'list', component: CompaniesListComponent},
]
