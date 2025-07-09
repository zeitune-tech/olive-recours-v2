import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoadingBarComponent } from './loading-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        LoadingBarComponent
    ],
    imports     : [
        CommonModule,
        MatProgressBarModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports     : [
        LoadingBarComponent
    ]
})
export class LoadingBarModule {
}
