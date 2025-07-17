import { Component, OnInit } from "@angular/core";
import { PERMISSIONS } from "@core/permissions/permissions.data";
import { LayoutService } from "@lhacksrt/services/layout/layout.service";

@Component({
    selector: "app-statements-global",
    templateUrl: "./global.component.html",
})

export class GlobalComponent implements OnInit {

  PERMISSIONS_DATA = PERMISSIONS;


    constructor(
        private _layoutService: LayoutService,
    ) {
    }

    ngOnInit(): void {
        this._layoutService.setPageTitle("États globaux");
        this._layoutService.setCrumbs([
            { title: "États", link: "/statements/global" },
            { title: "États globaux", link: "/statements/global" }
        ]);
    }


}