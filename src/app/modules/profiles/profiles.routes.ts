import { Routes } from "@angular/router";
import { ProfilesListComponent } from "./list/list.component";
import { ProfilesNewComponent } from './new/new.component';


export const routes: Routes = [
    {
        path: "list",
        component: ProfilesListComponent
    },
    {
        path: "new",
        component: ProfilesNewComponent
    }
]