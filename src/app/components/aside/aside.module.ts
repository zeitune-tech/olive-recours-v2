import { NgModule } from "@angular/core";
import { AsideHeaderComponent } from "./aside-header/aside-header.component";
import { AsideFooterComponent } from "./aside-footer/aside-footer.component";
import { AsideContentHeaderComponent } from "./aside-content-header/aside-content-header.component";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { NavigationModule } from "../../../@lhacksrt/components/navigation/navigation.module";
import { TranslocoModule } from "@jsverse/transloco";


@NgModule({
    declarations: [
        AsideContentHeaderComponent,
        AsideHeaderComponent,
        AsideFooterComponent,
    ],
    imports: [
        MatIconModule,
        MatButtonModule,
        NavigationModule,
        TranslocoModule
    ],
    exports: [
        AsideContentHeaderComponent,
        AsideHeaderComponent,
        AsideFooterComponent
    ],
})
export class AsideModule { }