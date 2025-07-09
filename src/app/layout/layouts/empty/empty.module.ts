import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EmptyLayoutComponent } from './empty.component';
import { CommonModule } from '@angular/common';
import { LoadingBarModule } from '../../../../@lhacksrt/components/loading-bar';

@NgModule({
    declarations: [
        EmptyLayoutComponent
    ],
    imports     : [
        RouterModule,
        LoadingBarModule,
        CommonModule
    ],
    exports     : [
        EmptyLayoutComponent
    ]
})
export class EmptyLayoutModule
{
}
