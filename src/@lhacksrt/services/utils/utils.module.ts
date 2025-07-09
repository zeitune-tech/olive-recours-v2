import { NgModule } from '@angular/core';
import { UtilsService } from './utils.service';
import { RouterModule } from '@angular/router';

@NgModule({
    providers: [
        UtilsService
    ],
    imports: [
        RouterModule
    ]
})
export class UtilsModule {
   
    constructor() { }
}
