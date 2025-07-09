import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { UntypedFormGroup, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


@Component({
    selector   : 'auth-step-two',
    templateUrl: './step-two.component.html'
})
export class StepTwoComponent  implements OnInit  {

    @Output() formReady = new EventEmitter<UntypedFormGroup>();
    formGroup!: UntypedFormGroup;
    /**
     * Constructor
     */
    constructor(
        private formBuilder: FormBuilder
    ) { 
        this.formGroup = this.formBuilder.group({
            entityType: ['', [Validators.required, this.validateType()]],
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

    validateType(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const validEntityTypes = ['ENTITY_SUPERIOR', 'COMPANY', 'POINT_OF_SALE'];
        
            if (control.value && !validEntityTypes.includes(control.value)) {
                return { invalidEntityType: { value: control.value } };
            }
        
            return null; // Return null if the input is valid
        };
    }
}