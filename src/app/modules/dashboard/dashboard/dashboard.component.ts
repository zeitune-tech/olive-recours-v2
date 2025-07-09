import { Component, OnInit } from "@angular/core";
import { Company } from "@core/services/company/company.interface";
import { CompanyService } from "@core/services/company/company.service";
import { User } from "@core/services/user/user.interface";
import { UserService } from "@core/services/user/user.service";
import { LayoutService } from "@lhacksrt/services/layout/layout.service";

@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
})
export class DashboardComponent implements OnInit {

    entity: Company = {} as Company;
    user: User = {} as User;

    constructor(
        private _userService: UserService,
        private _layoutService: LayoutService,
        private _compagnieService: CompanyService
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

        this._compagnieService.myCompany$.subscribe((company: Company) => {
            this.entity = company;
        });
    }

    

}