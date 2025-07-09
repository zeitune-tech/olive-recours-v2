import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { QuickChatComponent } from './quick-chat.component';
import { SharedModule } from '../../../shared/shared.module';
import { DrawerModule } from '../../../../@lhacksrt/components/drawer/drawer.module';
import { ScrollbarModule } from '../../../../@lhacksrt/directives/scrollbar';

@NgModule({
    declarations: [
        QuickChatComponent
    ],
    imports     : [
        RouterModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        DrawerModule,
        ScrollbarModule,
        SharedModule
    ],
    exports     : [
        QuickChatComponent
    ]
})
export class QuickChatModule
{
}
