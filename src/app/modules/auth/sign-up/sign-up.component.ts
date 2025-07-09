import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm, UntypedFormGroup } from '@angular/forms';
import { animations } from '@lhacksrt/animations';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ManagementEntity } from '@core/services/management-entity/management-entity.interface';
import { User } from '@core/services/user/user.interface';
import { CreationDialogComponent } from './creation-dialog/creation-dialog.component';

@Component({
    selector     : 'auth-sign-up',
    templateUrl  : './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : animations
})
export class AuthSignUpComponent implements OnInit {
    

    formGroup!: UntypedFormGroup;
    @ViewChild('form') form!: NgForm;

    showAlert: boolean = false;
     
    formStepOne!: UntypedFormGroup;
    formStepTwo!: UntypedFormGroup;
    formStepThree!: UntypedFormGroup;
    formStepFour!: UntypedFormGroup;

    selectedIndex: number = 0;
         
    constructor(
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
    }

    onStepTwoNext(fromGroup: UntypedFormGroup): void {
        this.formStepTwo = fromGroup;
    }

    onStepThreeNext(fromGroup: UntypedFormGroup): void {
        this.formStepThree = fromGroup;
    }

    onStepFourNext(fromGroup: UntypedFormGroup): void {
        this.formStepFour = fromGroup;
        this.signUp();
    }

    signUp(): void {

        const ENTITY_TYPES_ROLES = {
            'ENTITY_SUPERIOR': 'ENTITY_SUPERIOR_USER',
            'COMPANY': 'COMPANY_USER',
            'POINT_OF_SALE': 'BROKER_USER',
        }
        const type : 'ENTITY_SUPERIOR' | 'COMPANY' | 'POINT_OF_SALE' = this.formStepTwo.value.entityType || 'POINT_OF_SALE';
        const user: User = {
            firstName: this.formStepOne.value?.firstName || '',
            lastName: this.formStepOne.value?.lastName || '',
            email: this.formStepFour.value?.email || '',
            password: this.formStepFour.value?.password || '',
            entityAccessLevel: ENTITY_TYPES_ROLES[type]
        } as User;
        const entity: ManagementEntity = {
            name: this.formStepThree.value?.name || '',
            email: this.formStepThree.value?.email || '',
            level: type,
            phone: this.formStepThree.value?.phone || '',
            address: this.formStepThree.value?.address || '',
        } as ManagementEntity;
        const data = { user, entity };

        this._dialog.open(CreationDialogComponent, {
            data: data,
            disableClose: true
        })
        .afterClosed()
        .subscribe(result => {
            if (result === 'success') {
                this._router.navigate(['/signed-up-redirect']);
            }

            if (result === 'error') {
                this.showAlert = true;
            }
        });
    }

    createUser(): void {}

    createEntity(): void {}
}
