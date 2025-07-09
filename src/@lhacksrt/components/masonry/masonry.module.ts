import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasonryComponent } from './masonry.component';

@NgModule({
    declarations: [
        MasonryComponent
    ],
    imports     : [
        CommonModule
    ],
    exports     : [
        MasonryComponent
    ]
})
export class MasonryModule
{
}
