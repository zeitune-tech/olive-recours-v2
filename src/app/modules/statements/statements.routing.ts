import { Routes } from "@angular/router";
import { GlobalComponent } from "./global/global.component";
import { DetailedComponent } from "./detailed/detailed.component";


export const routes: Routes = [
    {
        path: 'global',
        component: GlobalComponent
    },
    {
        path: 'detailed',
        component: DetailedComponent
    }
]