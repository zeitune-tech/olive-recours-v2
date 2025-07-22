import { CompaniesListComponent } from "./users/companies/list/list.component";
import { RolesListComponent } from "./roles/list/list.component";
import { usersResolver } from "./users/users.resolver";
import { rolesResolver } from "./roles/roles.resolver";
import { Routes } from "@angular/router";
import { UsersListComponent } from "./users/employees/list/list.component";
import { ClosureComponent } from "./closure/closure.component";
import { closureResolver } from "./closure/closure.resolver";

export const adminRoutes: Routes = [
    {
        path: "",
        pathMatch: "full",
        redirectTo: "users/employees",
    },
    {
        path: "users/employees",
        component: UsersListComponent,
        resolve: {
            users: usersResolver
        }
    },
    {
        path: "users/companies",
        component: CompaniesListComponent,
        resolve: {
            companies: usersResolver
        }
    },
    {
        path: "roles",
        component: RolesListComponent,
        resolve: {
            roles: rolesResolver
        }
    },
    {
        path: "closures",
        component: ClosureComponent,
        resolve: {
            closure: closureResolver
        }
    }
]