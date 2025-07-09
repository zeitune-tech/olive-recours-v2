import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { routes } from "./claims.routing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ClaimsListComponent } from "./list/list.component";
import { ClaimNewComponent } from "./new/new.component";
import { SharedModule } from "@shared/shared.module";
import { TableModule } from "@lhacksrt/components/table/table.module";
import { ClaimDetailsComponent } from "./details/details.component";
import { DetailsChatComponent } from "./details/details-chat/details-chat.component";
import { DetailsAttachmentComponent } from "./details/details-attachement/details-attachment.component";
import { DetailsInformationsComponent } from "./details/details-informations/details-informations.component";
import { MatStepperModule } from "@angular/material/stepper";

@NgModule({
    declarations: [
        ClaimsListComponent,
        ClaimNewComponent,
        ClaimDetailsComponent,
        DetailsChatComponent,
        DetailsAttachmentComponent,
        DetailsInformationsComponent
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
        ReactiveFormsModule,
        SharedModule,
        TableModule,
        MatProgressSpinnerModule,
        MatStepperModule
    ],
    providers: [
    ],
    exports: [],
})
export class ClaimsModule { }