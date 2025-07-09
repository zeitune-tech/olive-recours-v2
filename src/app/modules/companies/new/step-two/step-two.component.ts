import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { UntypedFormGroup, FormBuilder, Validators } from "@angular/forms";
import { animations } from "@lhacksrt/animations";

@Component({
    selector: "app-company-new-step-two",
    templateUrl: "./step-two.component.html",
    animations: animations
})
export class CompanyNewStepTwoComponent implements OnInit {

    @Output() formReady = new EventEmitter<UntypedFormGroup>();
    formGroup!: UntypedFormGroup;
    /**
     * Constructor
     */
    constructor(
        private formBuilder: FormBuilder
    ) { 
        this.formGroup = this.formBuilder.group({
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: [''],
            password: ['P@sser123', [Validators.required, Validators.minLength(6)]],
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