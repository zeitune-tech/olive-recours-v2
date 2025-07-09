import { Component, EventEmitter, Output } from "@angular/core";
import { UntypedFormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
    selector: "app-profiles-new-step-one",
    templateUrl: "./step-one.component.html",
})
export class ProfilesNewStepOneComponent {


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
            description: [''],
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