import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ParamsService, ClosureRequest, ClosureResponse } from './params.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslocoPipe } from '@jsverse/transloco';
import { ConfirmationService } from '../../../../@lhacksrt/services/confirmation/confirmation.service';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslocoService } from '@jsverse/transloco';
import { LayoutService } from '@lhacksrt/services/layout/layout.service';
import { FeeRequest, FeeResponse, ModeEncaissementRequest, ModeEncaissementResponse } from './params.dto';

@Component({
  selector: 'app-params',
  standalone: true,
  templateUrl: './params.component.html',
  imports: [ReactiveFormsModule, CommonModule, MatFormFieldModule, MatInputModule, TranslocoPipe, MatDialogModule, DatePipe]
})
export class ParamsComponent implements OnInit {
  // Closure properties
  closureForm: FormGroup;
  closure: ClosureResponse | null = null;
  loading = false;
  error: string | null = null;

  // Fee properties
  feeForm: FormGroup;
  currentFee: FeeResponse | null = null;
  allFees: FeeResponse[] = [];
  loadingFee = false;
  errorFee: string | null = null;

  modeEncaissementForm: FormGroup;
  modesEncaissement: ModeEncaissementResponse[] = [];
  editingModeEncaissement: ModeEncaissementResponse | null = null;
  loadingModeEncaissement = false;
  errorModeEncaissement: string | null = null;

  months = [
    { value: 1, label: 'closure.months.janvier' },
    { value: 2, label: 'closure.months.février' },
    { value: 3, label: 'closure.months.mars' },
    { value: 4, label: 'closure.months.avril' },
    { value: 5, label: 'closure.months.mai' },
    { value: 6, label: 'closure.months.juin' },
    { value: 7, label: 'closure.months.juillet' },
    { value: 8, label: 'closure.months.aout' },
    { value: 9, label: 'closure.months.septembre' },
    { value: 10, label: 'closure.months.octobre' },
    { value: 11, label: 'closure.months.novembre' },
    { value: 12, label: 'closure.months.decembre' },
  ];

  constructor(private fb: FormBuilder, private paramsService: ParamsService, private confirmationService: ConfirmationService, private transloco: TranslocoService, private _layoutService: LayoutService) {
    // Initialize closure form
    this.closureForm = this.fb.group({
      exercise: [null, [Validators.required, Validators.min(2000)]],
      month: [null, [Validators.required, Validators.min(1), Validators.max(12)]]
    });

    // Initialize fee form
    this.feeForm = this.fb.group({
      rate: [null, [Validators.required, Validators.min(0)]],
      startDate: [null, [Validators.required]]
    });

    this.modeEncaissementForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(2)]],
      libelle: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  ngOnInit() {
    this._layoutService.setPageTitle(this.transloco.translate('layout.titles.params'));
    this._layoutService.setCrumbs([
      { title: this.transloco.translate('layout.crumbs.params'), link: '/admin/params', active: true }
    ]);

    // Initialize closure data
    this.paramsService.closure$.subscribe((closure) => {
      this.closure = closure;
      if (closure) {
        this.closureForm.patchValue({
          exercise: closure.exercise,
          month: closure.month
        });
      } else {
        this.closureForm.reset();
      }
    });

    // Initialize fee data
    this.paramsService.currentFee$.subscribe((fee) => {
      this.currentFee = fee;
      if (fee) {
        this.feeForm.patchValue({
          rate: fee.rate,
          startDate: fee.startDate
        });
      } else {
        this.feeForm.reset();
      }
    });

    this.paramsService.modesEncaissement$.subscribe((modes) => {
      this.modesEncaissement = modes;
    });

    // Load data
    this.loadData();
  }

  private loadData() {
    // Load closure data
    this.loading = true;
    this.paramsService.getClosure().subscribe({
      next: () => { this.loading = false; },
      error: (err) => {
        this.error = this.transloco.translate('closure.error.load');
        this.loading = false;
      }
    });

    // Load current fee
    this.loadingFee = true;
    this.paramsService.getCurrentFee().subscribe({
      next: () => { this.loadingFee = false; },
      error: (err) => {
        this.errorFee = this.transloco.translate('fees.error.load');
        this.loadingFee = false;
      }
    });

    // Load all fees for history
    this.paramsService.getAllFees().subscribe({
      next: (fees) => { this.allFees = fees; },
      error: (err) => {
        this.errorFee = this.transloco.translate('fees.error.load_history');
      }
    });

    this.loadingModeEncaissement = true;
    this.paramsService.getModesEncaissement().subscribe({
      next: () => { this.loadingModeEncaissement = false; },
      error: (err) => {
        this.errorModeEncaissement = this.transloco.translate('modes_encaissement.error.load');
        this.loadingModeEncaissement = false;
      }
    });
  }

  // Helper to check if a month/year is before the current closure
  isPastMonth(month: number, exercise: number): boolean {
    if (!this.closure) return false;
    if (exercise < this.closure.exercise) return true;
    if (exercise === this.closure.exercise && month < this.closure.month) return true;
    return false;
  }

  // Helper to check if the form value is the same as the current closure
  isSameClosure(formValue: any): boolean {
    if (!this.closure) return false;
    return (
      Number(formValue.exercise) === this.closure.exercise &&
      Number(formValue.month) === this.closure.month
    );
  }

  // Closure methods
  async submit() {
    if (this.closureForm.invalid) return;
    this.error = null;
    const formValue = this.closureForm.value;
    // Block if trying to set the same closure
    if (this.isSameClosure(formValue)) {
      this.error = this.transloco.translate('closure.error.same_date');
      return;
    }
    // If updating and the new date is before the current closure, show confirmation
    if (this.closure && (formValue.exercise < this.closure.exercise || (formValue.exercise === this.closure.exercise && formValue.month < this.closure.month))) {
      const dialogRef = this.confirmationService.open({
        title: this.transloco.translate('closure.confirmation.title'),
        message: this.transloco.translate('closure.confirmation.message'),
        icon: { show: true, name: 'heroicons_outline:exclamation', color: 'warn' },
        actions: {
          confirm: { show: true, label: this.transloco.translate('closure.confirmation.confirm'), color: 'warn' },
          cancel: { show: true, label: this.transloco.translate('closure.confirmation.cancel') }
        },
        dismissible: true
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'confirmed') {
          this.doSubmit(formValue);
        }
      });
      return;
    }
    this.doSubmit(formValue);
  }

  private doSubmit(formValue: any) {
    this.loading = true;
    const request: ClosureRequest = {
      ...formValue,
      month: Number(formValue.month)
    };
    const action = this.closure ? this.paramsService.updateClosure(request) : this.paramsService.createClosure(request);
    action.subscribe({
      next: () => { this.loading = false; },
      error: (err) => {
        this.error = this.transloco.translate('closure.error.save');
        this.loading = false;
      }
    });
  }

  deleteClosure() {
    if (!this.closure) return;
    this.loading = true;
    this.error = null;
    this.paramsService.deleteClosure().subscribe({
      next: () => { this.loading = false; },
      error: (err) => {
        this.error = 'Erreur lors de la suppression.';
        this.loading = false;
      }
    });
  }

  // Fee methods
  submitFee() {
    if (this.feeForm.invalid) return;
    this.errorFee = null;
    const formValue = this.feeForm.value;

    // Check if trying to set the same fee
    if (this.isSameFee(formValue)) {
      this.errorFee = this.transloco.translate('fees.error.same_rate');
      return;
    }

    this.doSubmitFee(formValue);
  }

  private doSubmitFee(formValue: any) {
    this.loadingFee = true;
    const request: FeeRequest = {
      rate: Number(formValue.rate),
      startDate: formValue.startDate
    };

    const action = this.currentFee ? this.paramsService.updateFee(request) : this.paramsService.createFee(request);
    action.subscribe({
      next: (response) => {
        this.loadingFee = false;
        // Reload all fees to update the history
        this.paramsService.getAllFees().subscribe({
          next: (fees) => { this.allFees = fees; }
        });
      },
      error: (err) => {
        this.errorFee = this.transloco.translate('fees.error.save');
        this.loadingFee = false;
      }
    });
  }

  // Helper to check if the form value is the same as the current fee
  isSameFee(formValue: any): boolean {
    if (!this.currentFee) return false;
    return (
      Number(formValue.rate) === this.currentFee.rate &&
      formValue.startDate === this.currentFee.startDate
    );
  }

  // Helper to check if a fee is the current active fee
  isCurrentFee(fee: FeeResponse): boolean {
    if (!this.currentFee) return false;
    return fee.id === this.currentFee.id;
  }

  deleteAllFees() {
    this.loadingFee = true;
    this.errorFee = null;
    this.paramsService.deleteAllFees().subscribe({
      next: () => { this.loadingFee = false; },
      error: (err) => {
        this.errorFee = 'Erreur lors de la suppression.';
        this.loadingFee = false;
      }
    });
  }

  submitModeEncaissement() {
    if (this.modeEncaissementForm.invalid) return;
    this.errorModeEncaissement = null;
    
    this.loadingModeEncaissement = true;
    const request: ModeEncaissementRequest = this.modeEncaissementForm.value;
    
    const action = this.editingModeEncaissement 
      ? this.paramsService.updateModeEncaissement(this.editingModeEncaissement.uuid, request)
      : this.paramsService.createModeEncaissement(request);
      
    action.subscribe({
      next: () => { 
        this.loadingModeEncaissement = false;
        this.resetModeEncaissementForm();
      },
      error: (err) => {
        this.errorModeEncaissement = this.transloco.translate('modes_encaissement.error.save');
        this.loadingModeEncaissement = false;
      }
    });
  }
  
  editModeEncaissement(mode: ModeEncaissementResponse) {
    this.editingModeEncaissement = mode;
    this.modeEncaissementForm.patchValue({
      code: mode.code,
      libelle: mode.libelle,
    });
  }
  
  deleteModeEncaissement(uuid: string) {
    const dialogRef = this.confirmationService.open({
      title: this.transloco.translate('modes_encaissement.confirmation.delete_title'),
      message: this.transloco.translate('modes_encaissement.confirmation.delete_message'),
      icon: { show: true, name: 'heroicons_outline:exclamation', color: 'warn' },
      actions: {
        confirm: { show: true, label: this.transloco.translate('buttons.delete'), color: 'warn' },
        cancel: { show: true, label: this.transloco.translate('buttons.cancel') }
      },
      dismissible: true
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirmed') {
        this.loadingModeEncaissement = true;
        this.paramsService.deleteModeEncaissement(uuid).subscribe({
          next: () => {
            this.loadingModeEncaissement = false;
            if (this.editingModeEncaissement?.uuid === uuid) {
              this.resetModeEncaissementForm();
            }
          },
          error: (err) => {
            this.errorModeEncaissement = this.transloco.translate('modes_encaissement.error.delete');
            this.loadingModeEncaissement = false;
          }
        });
      }
    });
  }
  
  resetModeEncaissementForm() {
    this.editingModeEncaissement = null;
    this.modeEncaissementForm.reset();
    this.errorModeEncaissement = null;
  }
}
