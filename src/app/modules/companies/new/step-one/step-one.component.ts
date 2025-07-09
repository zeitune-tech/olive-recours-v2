import { Component, EventEmitter, Output, OnInit } from "@angular/core";
import { UntypedFormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
    selector: "app-company-new-step-one",
    templateUrl: "./step-one.component.html",
})
export class CompanyNewStepOneComponent implements OnInit {


    @Output() formReady = new EventEmitter<UntypedFormGroup>();
    formGroup!: UntypedFormGroup;
    /**
     * Constructor
     */
    constructor(
        private formBuilder: FormBuilder
    ) { 
        this.formGroup = this.formBuilder.group({
            name: ['', Validators.required],
            acronym: [''],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.required,  Validators.pattern(/^((\+|00)?[1-9]\d{1,3})?[\s.-]?\(?\d{2,3}\)?[\s.-]?\d{3}[\s.-]?\d{2,4}$/)]],
            gsm: [''],
            fax: [''],
            address: [''],
            registrationNumber: [''],
        });
    }

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

    /**
     * Step one next
     */
    onNext(): void {
        this.formReady.emit(this.formGroup);
    }
}