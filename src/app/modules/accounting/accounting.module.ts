import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
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
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { RouterModule } from "@angular/router";
import { TableModule } from "@lhacksrt/components/table/table.module";
import { SharedModule } from "@shared/shared.module";
import { routes } from "./accounting.routing";
import { HasPermissionDirective } from "@core/permissions/has-permission.directive";
import { FeesComponent } from './fees/fees.component';
import { EncashmentComponent } from './encashment/encashment.component';
import { SettlementComponent } from "./settlement/settlement.component";
import { TranslocoDirective } from "@jsverse/transloco";
import { HttpClientModule } from "@angular/common/http";
import { MatTabsModule } from "@angular/material/tabs";
import { QuittanceStatementService } from "./quittance-statement.service";

@NgModule({
    declarations: [
        FeesComponent,
        EncashmentComponent,
        SettlementComponent
    ],
    imports: [
    RouterModule.forChild(routes),
    HttpClientModule,
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
    MatSnackBarModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TableModule,
    MatProgressSpinnerModule,
    HasPermissionDirective,
    TranslocoDirective,
    MatTabsModule,
    MatButtonToggleModule
],
    exports: [],
    providers: []
})
export class AccountingModule {
}