import { Component, OnInit, ViewChild } from "@angular/core";
import { UntypedFormGroup, NgForm } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { CompanyService } from "@core/services/company/company.service";
import { ManagementEntity } from "@core/services/management-entity/management-entity.interface";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-company-new",
    templateUrl: "./new.component.html",
})
export class CompanyNewComponent implements OnInit {


    private _unsubscribeAll: Subject<any> = new Subject<any>();


    formGroup!: UntypedFormGroup;
    @ViewChild('form') form!: NgForm;

    showAlert: boolean = false;
        
    formStepOne!: UntypedFormGroup;
    formStepTwo!: UntypedFormGroup;

    selectedIndex: number = 0;

    data: {
        managementEntity: {
            name: string;
            raisonSociale: string;
            email: string;
            phone: string;
            address: string;
            registrationNumber: string;
            gsm: string;
            fax: string;
        },
        user: {
            firstname: string;
            lastname: string;
            email: string;
            phone: string;
            password: string;
        }
    } = {
        managementEntity: {
            name: '',
            raisonSociale: '',
            email: '',
            phone: '',
            address: '',
            registrationNumber: '',
            gsm: '',
            fax: ''
        },
        user: {
            firstname: '',
            lastname: '',
            email: '',
            phone: '',
            password: 'P@sser123'
        }
    };

    managementEntity!: ManagementEntity;

    constructor(
        private _companyService: CompanyService,
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
        this.data.managementEntity = fromGroup.value;
    }


    onStepTwoNext(fromGroup: UntypedFormGroup): void {
        this.formStepTwo = fromGroup;
        this.data.user = fromGroup.value;
    }


    save(): void {
        this._companyService.create(this.data).pipe(takeUntil(this._unsubscribeAll)).subscribe((managementEntity: ManagementEntity) => {
            this.managementEntity = managementEntity;
            this._companyService.getCompaniesAll().subscribe();
            this._router.navigate(['/companies']);
        });        
    }
}