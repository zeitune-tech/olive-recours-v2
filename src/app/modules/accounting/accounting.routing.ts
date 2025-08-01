import { Routes, ResolveFn } from "@angular/router";
import { EncashmentComponent } from "./encashment/encashment.component";
import { SettlementComponent } from "./settlement/settlement.component";
import { FeesComponent } from "./fees/fees.component";
import { inject } from "@angular/core";
import { UserService } from "@core/services/user/user.service";
import { ManagementEntity } from "@core/services/management-entity/management-entity.interface";

export const managementEntityResolver: ResolveFn<ManagementEntity | null> = (route, state) => {
    const userService = inject(UserService);
    return userService.getManagementEntity();
};

export const routes: Routes = [
    {
        path: 'fees',
        component: FeesComponent
    },
    {
        path: 'settlement',
        component: SettlementComponent,
        resolve: {
            managementEntity: managementEntityResolver
        }
    },
    {
        path: 'encashment',
        component: EncashmentComponent,
        resolve: {
            managementEntity: managementEntityResolver
        }
    }
];
