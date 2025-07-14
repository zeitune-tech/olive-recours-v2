import { Routes } from "@angular/router";
import { PERMISSIONS } from "@core/permissions/permissions.data";
import { ClaimsListComponent } from "./list/list.component";
import { ClaimNewComponent } from "./new/new.component";
import { ClaimDetailsComponent } from "./details/details.component";
import { claimsResolver } from "./claims.resolver";
import { newClaimResolver } from "./new/new-claim.resolver";

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
        component: ClaimNewComponent,
        resolve: {
            claim: newClaimResolver
        }
    }
];