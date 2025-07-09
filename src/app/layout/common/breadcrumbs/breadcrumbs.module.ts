import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { BreadcrumbsComponent } from "./breadcrumbs.component";
import { RouterModule } from "@angular/router";


@NgModule({
    declarations: [
        BreadcrumbsComponent
    ],
    imports: [
        CommonModule,
        MatIconModule,
        RouterModule
    ],
    exports: [
        BreadcrumbsComponent
    ]
})
export class BreadcrumbsModule { }