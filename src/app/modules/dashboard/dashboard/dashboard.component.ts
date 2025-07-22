import { Component, OnInit } from "@angular/core";
import { PERMISSIONS } from "@core/permissions/permissions.data";
import { ManagementEntity } from "@core/services/management-entity/management-entity.interface";
import { User } from "@core/services/user/user.interface";
import { UserService } from "@core/services/user/user.service";
import { TranslocoService } from "@jsverse/transloco";
import { LayoutService } from "@lhacksrt/services/layout/layout.service";

@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
})
export class DashboardComponent implements OnInit {

    entity: ManagementEntity = {} as ManagementEntity;
    user: User = {} as User;
    PERMISSIONS_DATA = PERMISSIONS;

    constructor(
        private _userService: UserService,
        private _layoutService: LayoutService,
        private transloco: TranslocoService
    ) {
        
    }

    ngOnInit(): void {

        this._layoutService.setPageTitle(this.transloco.translate('layout.titles.dashboard'));
        this._layoutService.setCrumbs([
            { title: this.transloco.translate('layout.crumbs.dashboard'), link: '/dashboard', active: true }
        ]);
        
        this._userService.user$.subscribe((user: User) => {
            this.user = user;
        });

        this._userService.managementEntity$.subscribe((entity: ManagementEntity) => {
            this.entity = entity;
        });
    }

}