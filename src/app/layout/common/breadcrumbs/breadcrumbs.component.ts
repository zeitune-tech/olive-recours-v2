import { Component, Input, OnInit } from "@angular/core";
import { LayoutService } from '@lhacksrt/services/layout/layout.service';


@Component({
    selector: 'breadcrumbs',
    templateUrl: './breadcrumbs.component.html',
})
export class BreadcrumbsComponent implements OnInit {

    crumbs: {
        title: string;
        link: string;
        active?: boolean;
    }[] = [];

    isSmallScreen: boolean = false;
  
    constructor(
        private _layoutService: LayoutService
    ) { }
  
    ngOnInit() {
        this.isSmallScreen = this._layoutService.isScreenSmall;
        this._layoutService.crumbs$.subscribe({
            next: (res) => {
                this.crumbs = res;
            }
        });
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}