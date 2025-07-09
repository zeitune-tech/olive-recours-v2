import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { SharedModule } from '../../../../shared/shared.module';
import { FullscreenModule } from '../../../../../@lhacksrt/components/fullscreen/fullscreen.module';
import { LoadingBarModule } from '../../../../../@lhacksrt/components/loading-bar/loading-bar.module';
import { NavigationModule } from '../../../../../@lhacksrt/components/navigation/navigation.module';
import { LanguagesModule } from '../../../common/languages/languages.module';
import { MessagesModule } from '../../../common/messages/messages.module';
import { NotificationsModule } from '../../../common/notifications/notifications.module';
import { QuickChatModule } from '../../../common/quick-chat/quick-chat.module';
import { SearchModule } from '../../../common/search/search.module';
import { ShortcutsModule } from '../../../common/shortcuts/shortcuts.module';
import { UserModule } from '../../../common/user/user.module';
import { CustomLayoutComponent } from './custom.component';
import { HeaderModule } from '../../../common/header/header.module';
import { CommonModule } from '@angular/common';


@NgModule({
    declarations: [
        CustomLayoutComponent
    ],
    imports     : [
        MatButtonModule,
        RouterModule,
        LoadingBarModule,
        NotificationsModule,
        UserModule,
        SharedModule,
        HeaderModule,
        CommonModule
    ],
    exports     : [
        CustomLayoutComponent
    ]
})
export class CustomLayoutModule { }
