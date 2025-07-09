import { NgModule } from "@angular/core";
import e from "express";
import { TableService } from "./table.service";
import { TableComponent } from "./table.component";
import { MatTableModule } from "@angular/material/table";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatSortModule } from "@angular/material/sort";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SharedModule } from "../../../app/shared/shared.module";

@NgModule({
    declarations: [
        TableComponent
    ],
    imports: [
        MatTableModule,
        MatCheckboxModule,
        SharedModule,
        MatIconModule,
        MatMenuModule,
        MatPaginatorModule,
        MatSortModule,
        MatButtonModule,

        FormsModule,
        MatTooltipModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatButtonToggleModule

    ],
    exports: [
        TableComponent
    ],
    providers: [
        TableService
    ]
})
export class TableModule { }