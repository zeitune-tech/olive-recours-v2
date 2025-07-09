import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { UserComponent } from './user.component';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';

@NgModule({
    declarations: [
        UserComponent
    ],
    imports     : [
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        CommonModule,
        TranslocoModule
    ],
    exports     : [
        UserComponent
    ]
})
export class UserModule{

}
