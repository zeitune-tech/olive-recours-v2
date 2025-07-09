import { Component, OnInit } from "@angular/core";
import { LayoutService } from "../../../../@lhacksrt/services/layout/layout.service";


@Component({
    selector: 'aside-footer',
    templateUrl: './aside-footer.component.html',
})
export class AsideFooterComponent implements OnInit {

    isSmallScreen: boolean = false;
    isClassyLayout: boolean = false;

    constructor(
        private _loayoutService: LayoutService
    ) { }

    ngOnInit() {
        this.isSmallScreen = this._loayoutService.isScreenSmall;
        this.isClassyLayout = this._loayoutService.isClassyLayout;
    }
}