import { NgModule } from "@angular/core";
import { TicketsComponent } from "./tickets.component";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";


@NgModule({
    declarations: [
        TicketsComponent
    ],
    imports: [
        MatIconModule,
        CommonModule,
        MatMenuModule
    ],
    exports: [
        TicketsComponent
    ]
})
export class TicketsModule {
    constructor() { }
}