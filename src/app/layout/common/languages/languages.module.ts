import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { LanguagesComponent } from './languages.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        LanguagesComponent
    ],
    imports     : [
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        CommonModule,
    ],
    exports     : [
        LanguagesComponent
    ]
})
export class LanguagesModule
{
}
