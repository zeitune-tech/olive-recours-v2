import { Component, OnDestroy, OnInit } from "@angular/core";
import { LayoutService } from "../../../../@lhacksrt/services/layout/layout.service";
import { AppNavigationService } from "../../../../@lhacksrt/components";
import { VerticalNavigationComponent } from "../../../../@lhacksrt/components/navigation/vertical/vertical.component";


@Component({
    selector: 'header',
    templateUrl: './header.component.html',
})

export class HeaderComponent implements OnInit, OnDestroy { 

    constructor(
        private _layoutService: LayoutService,
        private _appNavigationService: AppNavigationService
    ) { }

    ngOnInit(): void { }

    ngOnDestroy(): void { }

    toggleNavigation(): void { 
        this.toggle('mainNavigation');
    }

    private toggle(name: string): void {
        // Get the navigation
        const navigation = this._appNavigationService.getComponent<VerticalNavigationComponent>(name);

        if ( navigation ) {
            // Toggle the opened status
            navigation.toggle();
        }
    }
}