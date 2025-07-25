import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatNativeDateModule } from "@angular/material/core";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule } from "@angular/router";
import { TableModule } from "@lhacksrt/components/table/table.module";
import { SharedModule } from "@shared/shared.module";
import { routes } from "./accounting.routing";
import { HasPermissionDirective } from "@core/permissions/has-permission.directive";
import { FeesComponent } from './fees/fees.component';
import { EncashmentComponent } from './encashment/encashment.component';
import { SettlementComponent } from "./settlement/settlement.component";

@NgModule({
    declarations: [
        FeesComponent,
        EncashmentComponent,
        SettlementComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MatIconModule,
        MatTableModule,
        MatPaginatorModule,
        MatMenuModule,
        MatTooltipModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDividerModule,
        MatDatepickerModule,
        MatNativeDateModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        TableModule,
        MatProgressSpinnerModule,
        HasPermissionDirective
    ],
    exports: [],
    providers: []
})
export class AccountingModule {
}