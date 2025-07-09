import { Routes } from "@angular/router";
import { PERMISSIONS } from "@core/permissions/permissions.data";
import { ClaimsListComponent } from "./list/list.component";
import { ClaimNewComponent } from "./new/new.component";
import { ClaimDetailsComponent } from "./details/details.component";

export const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        redirectTo: "list",
    },
    {
        path: "list",
        component: ClaimsListComponent
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