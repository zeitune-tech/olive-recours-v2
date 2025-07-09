import { NgModule } from "@angular/core";
import { SettingsModule } from "./common/settings/settings.module";
import { EmptyLayoutModule } from "./layouts/empty/empty.module";
import { ClassyLayoutModule } from "./layouts/vertical/classy/classy.module";
import { ThinLayoutModule } from "./layouts/vertical/thin/thin.module";
import { SharedModule } from "../shared/shared.module";
import { LayoutComponent } from "./layout.component";
import { AsideModule } from "../components/aside/aside.module";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { CustomLayoutModule } from "./layouts/vertical/custom/custom.module";

const layoutModules = [
    // Empty
    EmptyLayoutModule,

    // Vertical navigation
    ClassyLayoutModule,
    ThinLayoutModule,
    CustomLayoutModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,

    SettingsModule
];

@NgModule({
    declarations: [
        LayoutComponent
    ],
    imports: [
    SharedModule,
    AsideModule,
    ...layoutModules,
    CustomLayoutModule
],
    exports     : [
        LayoutComponent,
        ...layoutModules
    ]
})
export class LayoutModule { }
