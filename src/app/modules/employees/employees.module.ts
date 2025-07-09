import { NgModule } from "@angular/core";
import { EmployeesListComponent } from "./list/list.component";
import { RouterModule } from "@angular/router";
import { routes } from "./employees.routing";
import { EmployeesNewComponent } from "./new/new.component";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TableModule } from "@lhacksrt/components/table/table.module";
import { SharedModule } from "@shared/shared.module";
import { MatStepperModule } from "@angular/material/stepper";
import { DialogModule } from "@angular/cdk/dialog";
import { CommonModule } from "@angular/common";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ConfirmDialogComponent } from "@shared/components/confirm-dialog/confirm-dialog.component";

@NgModule({
    declarations: [
        EmployeesListComponent,
        EmployeesNewComponent,
        ConfirmDialogComponent,
        
    ],
    imports: [
        RouterModule.forChild(routes),
        MatIconModule,
        SharedModule,
        MatTableModule,
        MatPaginatorModule,
        MatMenuModule,
        MatTooltipModule,
        TableModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDividerModule,
        ReactiveFormsModule,
        MatStepperModule,
        MatProgressSpinnerModule,
        CommonModule,
        RouterModule,
        DialogModule,
    ],
    providers: [],
    exports: []
})
export class EmployeesModule { }