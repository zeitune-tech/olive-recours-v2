import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AuthService } from "@core/auth/auth.service";
import { ManagementEntity } from "@core/services/management-entity/management-entity.interface";
import { ManagementEntityService } from "@core/services/management-entity/management-entity.service";


@Component({
    selector   : 'auth-creation-dialog',
    templateUrl: './creation-dialog.component.html'
})
export class CreationDialogComponent implements OnInit {

    loading = false;
    message =""
    loadingMessage = "Validating data...";
    error = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _dialogRef: MatDialogRef<CreationDialogComponent>,
        private _authService: AuthService,
        private _managementEntityService: ManagementEntityService
    ) { }

    ngOnInit(): void {
        this.create();
    }

    create(): void {
        this.loading = true;
        setTimeout(() => {
            this.createUser();
        }, 1000);
    }

    createUser(): void {
        this.loadingMessage = "Creating user...";
        this._authService.signUp(this.data.user).subscribe({
            next: (_) => {
                this.createEntity();
            },
            error: (error: any) => {
                this.error = true;
                this.message = error?.error;
                this.loading = false;
            }
        });
    }

    createEntity(): void {
        this.loadingMessage = "Creating entity...";
        this._managementEntityService.create(this.data.entity).subscribe({
            next: (_: ManagementEntity) => {
                this.error = false;
                this.loading = false;
                this.message = "User and entity created successfully!";
            },
            error: (error: any) => {
                this.error = true;
                this.message = error?.error;
                this.loading = false;
            }
        });
    }



    close(): void {
        if (this.error) {
            this._dialogRef.close("error");
        }

        else {
            this._dialogRef.close("success");
        }
    }
}