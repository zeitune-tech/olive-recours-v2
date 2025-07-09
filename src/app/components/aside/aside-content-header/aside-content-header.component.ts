import { Component, OnInit } from "@angular/core";
import { LayoutService } from "../../../../@lhacksrt/services/layout/layout.service";
import { ActivatedRoute, Router, UrlSegment } from "@angular/router";
import { NavigationItem } from "../../../../@lhacksrt/components";


@Component({
    selector: 'aside-content-header',
    templateUrl: './aside-content-header.component.html',
})
export class AsideContentHeaderComponent implements OnInit {

    isClassyLayout: boolean = false;
    item: NavigationItem = {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        icon: 'mat_outline:dashboard',
        link: '/app/dashboard',
        classes: {
            title: 'uppercase'
        },
    };

    constructor(
        private _layoutService: LayoutService,
        private _router: Router
    ) { }

    ngOnInit() {
        this.isClassyLayout = this._layoutService.isClassyLayout;
    }

    navigateToDashboard() {
        if (this._router.url.includes('dashboard')) {
            console.log('Already on dashboard');
            return;
        }
        this._router.navigate(['/dashboard']);
    }

    isActive(): boolean {
        return this._router.url.includes("dashboard");
    }
}