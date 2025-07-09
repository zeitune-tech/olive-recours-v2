import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, UntypedFormGroup, Validators } from "@angular/forms";


@Component({
    selector   : 'auth-step-four',
    templateUrl: './step-four.component.html'
})
export class StepFourComponent implements OnInit {

    @Output() formReady = new EventEmitter<UntypedFormGroup>();
    formGroup!: UntypedFormGroup;
    /**
     * Constructor
     */
    constructor(
        private formBuilder: FormBuilder
    ) { 
        this.formGroup = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required],
            termsAndConditions: [false, Validators.requiredTrue]
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

    signUp(): void {
        if (this.formGroup.invalid) {
            return;
        }
        alert("hello")
        this.confirmPassword();
    }

    confirmPassword(): void {
        const password = this.formGroup.get('password')?.value;
        const confirmPassword = this.formGroup.get('confirmPassword')?.value;
        if (password !== confirmPassword) {
            this.formGroup.get('confirmPassword')?.setErrors({ notEqual: true });
        }
    }
}