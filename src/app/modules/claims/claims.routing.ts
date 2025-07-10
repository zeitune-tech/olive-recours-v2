import { Routes } from "@angular/router";
import { PERMISSIONS } from "@core/permissions/permissions.data";
import { ClaimsListComponent } from "./list/list.component";
import { ClaimNewComponent } from "./new/new.component";
import { ClaimDetailsComponent } from "./details/details.component";
import { claimsResolver } from "./claims.resolver";

export const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        redirectTo: "list",
    },
    {
        path: "list",
        component: ClaimsListComponent,
        resolve: {
            claims: claimsResolver
        }
    },
    {
        path: "list/:id",
        component: ClaimDetailsComponent
    },
    {
        path: "new",
        component: ClaimNewComponent
    }
];