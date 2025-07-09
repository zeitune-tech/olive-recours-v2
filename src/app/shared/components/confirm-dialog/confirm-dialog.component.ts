import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: 'confirm-dialog',
    templateUrl: './confirm-dialog.component.html'
})
export class ConfirmDialogComponent {
    
    title: string = '';
    description: string = '';
    message: string = '';

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _dialogRef: MatDialogRef<ConfirmDialogComponent>,
    ) {
        this.title = data.title;
        this.description = data.description;
        this.message = data.message;
    }

    close(): void {
        this._dialogRef.close();
    }

    confirm(): void {
        this.data.confirm();
    }
}