import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HorizontalNavigationBasicItemComponent } from './horizontal/components/basic/basic.component';
import { HorizontalNavigationBranchItemComponent } from './horizontal/components/branch/branch.component';
import { HorizontalNavigationDividerItemComponent } from './horizontal/components/divider/divider.component';
import { HorizontalNavigationSpacerItemComponent } from './horizontal/components/spacer/spacer.component';
import { HorizontalNavigationComponent } from './horizontal/horizontal.component';
import { VerticalNavigationAsideItemComponent } from './vertical/components/aside/aside.component';
import { VerticalNavigationBasicItemComponent } from './vertical/components/basic/basic.component';
import { VerticalNavigationCollapsableItemComponent } from './vertical/components/collapsable/collapsable.component';
import { VerticalNavigationDividerItemComponent } from './vertical/components/divider/divider.component';
import { VerticalNavigationGroupItemComponent } from './vertical/components/group/group.component';
import { VerticalNavigationSpacerItemComponent } from './vertical/components/spacer/spacer.component';
import { VerticalNavigationComponent } from './vertical/vertical.component';
import { ScrollbarModule } from '../../directives/scrollbar';
import { ScrollResetModule } from '../../directives/scroll-reset';
import { TranslocoCoreModule } from '../../../app/core/transloco/transloco.module';

@NgModule({
    declarations: [
        HorizontalNavigationBasicItemComponent,
        HorizontalNavigationBranchItemComponent,
        HorizontalNavigationDividerItemComponent,
        HorizontalNavigationSpacerItemComponent,
        HorizontalNavigationComponent,
        VerticalNavigationAsideItemComponent,
        VerticalNavigationBasicItemComponent,
        VerticalNavigationCollapsableItemComponent,
        VerticalNavigationDividerItemComponent,
        VerticalNavigationGroupItemComponent,
        VerticalNavigationSpacerItemComponent,
        VerticalNavigationComponent
    ],
    imports     : [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatTooltipModule,
        ScrollbarModule,
        ScrollResetModule,
        TranslocoCoreModule
    ],
    exports     : [
        HorizontalNavigationComponent,
        VerticalNavigationComponent,
        VerticalNavigationBasicItemComponent
    ]
})
export class NavigationModule
{
}
