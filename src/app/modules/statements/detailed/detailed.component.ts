import { Component, OnInit } from "@angular/core";
import { PERMISSIONS } from "@core/permissions/permissions.data";
import { TranslocoService } from "@jsverse/transloco";
import { LayoutService } from "@lhacksrt/services/layout/layout.service";

@Component({
    selector: "app-statements-detailed",
    templateUrl: "./detailed.component.html",
})

export class DetailedComponent implements OnInit {

  PERMISSIONS_DATA = PERMISSIONS;


  constructor(
    private _layoutService: LayoutService,
    private transloco : TranslocoService
) {
}

ngOnInit(): void {
    this._layoutService.setPageTitle(this.transloco.translate('layout.titles.statements'));
    this._layoutService.setCrumbs([
        { title: this.transloco.translate('layout.crumbs.statements'), link: '#', active: false },
        { title: this.transloco.translate('layout.crumbs.statements-detailed'), link: '/statements/detailed', active: true }
    ]);
}

}