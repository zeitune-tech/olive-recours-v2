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
    date?: string;
    now: Date = new Date();

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _dialogRef: MatDialogRef<ConfirmDialogComponent>,
    ) {
        this.title = data.title;
        this.description = data.description;
        this.message = data.message;
        if (data.showDateInput) {
            // Par défaut, ne pas pré-remplir la date (l'utilisateur doit choisir pour l'envoyer)
            this.date = undefined;
        }
    }

    close(): void {
        this._dialogRef.close();
    }

    confirm(): void {
        if (this.data.showDateInput) {
            this._dialogRef.close(this.date ? { date: this.date } : {});
        } else {
            this.data.confirm();
        }
    }
}