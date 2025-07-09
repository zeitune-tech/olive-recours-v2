import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: "app-new-demand",
    templateUrl: "./new-demand.component.html",
})
export class NewDemandComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _dialogRef: MatDialogRef<NewDemandComponent>,
    ) {}

    close(): void {
        this._dialogRef.close();
    }
}