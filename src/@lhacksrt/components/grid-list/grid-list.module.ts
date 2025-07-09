import { NgModule } from "@angular/core";
import { GridListComponent } from "./grid-list.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedModule } from "../../../app/shared/shared.module";
import { GridListService } from "./grid-list.service";
import { GridListItemComponent } from "./grid-list-item/grid-list-item.component";
import { RouterModule } from "@angular/router";


@NgModule({
    declarations: [
        GridListComponent,
        GridListItemComponent,
    ],
    imports: [
        SharedModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressBarModule,
        MatSelectModule,
        MatSidenavModule,
        MatSlideToggleModule,
        MatTooltipModule,
        MatTabsModule
    ],
    exports: [
        GridListComponent
    ],
    providers: [
        GridListService
    ]
})
export class GridListModule {}