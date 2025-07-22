import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ClosureService, ClosureRequest, ClosureResponse } from './closure.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslocoPipe } from '@jsverse/transloco';
import { ConfirmationService } from '../../../../@lhacksrt/services/confirmation/confirmation.service';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslocoService } from '@jsverse/transloco';
import { LayoutService } from '@lhacksrt/services/layout/layout.service';

@Component({
  selector: 'app-closure',
  standalone: true,
  templateUrl: './closure.component.html',
  imports: [ReactiveFormsModule, CommonModule, MatFormFieldModule, MatInputModule, TranslocoPipe, MatDialogModule]
})
export class ClosureComponent implements OnInit {
  closureForm: FormGroup;
  closure: ClosureResponse | null = null;
  loading = false;
  error: string | null = null;
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

  constructor(private fb: FormBuilder, private closureService: ClosureService, private confirmationService: ConfirmationService, private transloco: TranslocoService, private _layoutService: LayoutService) {
    this.closureForm = this.fb.group({
      exercise: [null, [Validators.required, Validators.min(2000)]],
      month: [null, [Validators.required, Validators.min(1), Validators.max(12)]]
    });
  }

  ngOnInit() {
    this._layoutService.setPageTitle(this.transloco.translate('layout.titles.closures'));
    this._layoutService.setCrumbs([
      { title: this.transloco.translate('layout.crumbs.closures'), link: '/admin/closures', active: true }
    ]);

    this.closureService.closure$.subscribe((closure) => {
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
    const action = this.closure ? this.closureService.updateClosure(request) : this.closureService.createClosure(request);
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
    this.closureService.deleteClosure().subscribe({
      next: () => { this.loading = false; },
      error: (err) => {
        this.error = 'Erreur lors de la suppression.';
        this.loading = false;
      }
    });
  }
}
