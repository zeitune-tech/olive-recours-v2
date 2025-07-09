import { Component, ViewChild } from '@angular/core';
import { UntypedFormGroup, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EmployeeService } from '@core/services/employee/employee.service';
import { ManagementEntity } from '@core/services/management-entity/management-entity.interface';
import { ProfileService } from '@core/services/profile/profile.service';
import { UserService } from '@core/services/user/user.service';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-profiles-new',
    templateUrl: './new.component.html',
})
export class ProfilesNewComponent {


    private _unsubscribeAll: Subject<any> = new Subject<any>();

    formGroup!: UntypedFormGroup;
    @ViewChild('form') form!: NgForm;

    showAlert: boolean = false;
        
    formStepOne!: UntypedFormGroup;
    formStepTwo!: UntypedFormGroup;
    formStepThree!: UntypedFormGroup;
    

    selectedIndex: number = 0;

    data: any = {
        name: '',
        description: '',
        permissions: []
    };

    constructor(
        private _userService: UserService,
        private _profileService: ProfileService,
        private _dialog: MatDialog,
        private _router: Router
    ) {  }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
    * On init
    */
    ngOnInit(): void {
        
        
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    onStepOneNext(fromGroup: UntypedFormGroup): void {
        this.formStepOne = fromGroup;
        this.data.name = fromGroup.value.name;
        this.data.description = fromGroup.value.description;
    }


    onStepTwoNext(fromGroup: UntypedFormGroup): void {
        this.formStepTwo = fromGroup;
        this.data.permissions = fromGroup.value.permissions;

    }

    save(): void {
        this._profileService.create(this.data)
            .subscribe(() => {
                this.showAlert = true;
                setTimeout(() => {
                    this.showAlert = false;
                    this._router.navigate(['/profile/list']);
                }, 500);
            });
    }
}