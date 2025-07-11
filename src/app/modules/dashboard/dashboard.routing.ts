import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { DashboardResolver } from "./dashboard.resolver";

export const routes: Routes = [
    { path: '', component: DashboardComponent, resolve: { data: DashboardResolver } },
]
