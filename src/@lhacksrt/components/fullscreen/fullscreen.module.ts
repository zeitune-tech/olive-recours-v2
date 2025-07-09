import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FullscreenComponent } from './fullscreen.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        FullscreenComponent
    ],
    imports     : [
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        CommonModule
    ],
    exports     : [
        FullscreenComponent
    ]
})
export class FullscreenModule {
}
