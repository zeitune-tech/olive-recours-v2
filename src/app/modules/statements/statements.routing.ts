import { Routes } from "@angular/router";
import { GlobalComponent } from "./global/global.component";
import { DetailedComponent } from "./detailed/detailed.component";
import { AnnexeComponent } from "./annexe/annexe.component";


export const routes: Routes = [
    {
        path: 'global',
        component: GlobalComponent
    },
    {
        path: 'detailed',
        component: DetailedComponent
    },
    {
        path: 'annexe',
        component: AnnexeComponent
    }
]