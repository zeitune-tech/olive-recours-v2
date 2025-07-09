import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { routes } from "./error.routes";


@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    declarations: [],
    providers: []
})
export class ErrorModule { }