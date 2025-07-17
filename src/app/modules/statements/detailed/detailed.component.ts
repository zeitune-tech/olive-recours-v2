import { Component, OnInit } from "@angular/core";
import { PERMISSIONS } from "@core/permissions/permissions.data";
import { LayoutService } from "@lhacksrt/services/layout/layout.service";

@Component({
    selector: "app-statements-detailed",
    templateUrl: "./detailed.component.html",
})

export class DetailedComponent implements OnInit {

  PERMISSIONS_DATA = PERMISSIONS;


    constructor(
        private _layoutService: LayoutService,
    ) {
    }

    ngOnInit(): void {
        this._layoutService.setPageTitle("États détaillés");
        this._layoutService.setCrumbs([
            { title: "États", link: "/statements/detailed" },
            { title: "États détaillés", link: "/statements/detailed" }
        ]);
    }


}