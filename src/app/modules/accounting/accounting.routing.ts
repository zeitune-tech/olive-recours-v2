import { Routes } from "@angular/router";
import { FeesComponent } from "./fees/fees.component";
import { EncashmentComponent } from "./encashment/encashment.component";
import { SettlementComponent } from "./settlement/settlement.component";


export const routes: Routes = [
    {
        path: 'fees',
        component: FeesComponent
    },
    {
        path: 'settlement',
        component: SettlementComponent
    },
    {
        path: 'encashment',
        component: EncashmentComponent
    }
]