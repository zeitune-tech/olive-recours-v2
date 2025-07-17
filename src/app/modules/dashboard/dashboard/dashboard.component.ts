import { Component, OnInit } from "@angular/core";
import { PERMISSIONS } from "@core/permissions/permissions.data";
import { ManagementEntity } from "@core/services/management-entity/management-entity.interface";
import { User } from "@core/services/user/user.interface";
import { UserService } from "@core/services/user/user.service";
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
    ) { 
        this._layoutService.setPageTitle("Dashboard");
        this._layoutService.setCrumbs([
            { title: "Dashboard", link: "/dashboard", active: true }
        ])
    }

    ngOnInit(): void {
        this._userService.user$.subscribe((user: User) => {
            this.user = user;
        });

        this._userService.managementEntity$.subscribe((entity: ManagementEntity) => {
            this.entity = entity;
        });
    }

}