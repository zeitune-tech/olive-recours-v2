import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { DialogModule } from '@angular/cdk/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { NewDemandComponent } from './components/new-demand/new-demand.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { ToastModule } from '../components/toast/toast.module';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { DatePipe } from '@angular/common';

@NgModule({
    declarations: [
        NewDemandComponent,
        ConfirmDialogComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslocoModule,
        DialogModule,
        MatDialogModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatDividerModule,
        ToastModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslocoModule,
        ToastModule,
        ConfirmDialogComponent
    ],
    providers: [DatePipe]
})
export class SharedModule
{
}
