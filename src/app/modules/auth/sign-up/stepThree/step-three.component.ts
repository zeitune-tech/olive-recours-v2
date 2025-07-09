import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { UntypedFormGroup, FormBuilder, FormGroup, Validators } from "@angular/forms";


@Component({
    selector   : 'auth-step-three',
    templateUrl: './step-three.component.html'
})
export class StepThreeComponent implements OnInit  {

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
            email: ['', [Validators.required, Validators.email]],
            phone: [''],
            address: ['']
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