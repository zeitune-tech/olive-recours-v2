import { UsersListComponent } from "./users/list/list.component";
import { UserDetailsComponent } from "./users/details/details.component";
import { RolesListComponent } from "./roles/list/list.component";
import { RoleDetailsComponent } from "./roles/details/details.component";
import { usersResolver } from "./users/users.resolver";
import { rolesResolver } from "./roles/roles.resolver";
import { Routes } from "@angular/router";

export const adminRoutes: Routes = [
    {
        path: "",
        pathMatch: "full",
        redirectTo: "users",
    },
    {
        path: "users",
        component: UsersListComponent,
        resolve: {
            users: usersResolver
        }
    },
    {
        path: "users/:id",
        component: UserDetailsComponent
    },
    {
        path: "roles",
        component: RolesListComponent,
        resolve: {
            roles: rolesResolver
        }
    },
    {
        path: "roles/:id",
        component: RoleDetailsComponent
    }
]