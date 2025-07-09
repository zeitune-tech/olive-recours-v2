import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { ErrorDialogComponent } from "./error-dialog.component";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { ErrorInterceptor } from "./error.interceptor";


@NgModule({
    declarations: [
        ErrorDialogComponent
    ],
    imports: [
        MatDialogModule,
        MatButtonModule,
        MatIconModule
    ],
    exports: [],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ]
})
export class ErroDialogModule { }