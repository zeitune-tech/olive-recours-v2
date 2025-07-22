import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ClosureService, ClosureRequest, ClosureResponse } from './closure.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-closure',
  standalone: true,
  templateUrl: './closure.component.html',
  imports: [ReactiveFormsModule, CommonModule, MatFormFieldModule, MatInputModule, TranslocoPipe]
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

  constructor(private fb: FormBuilder, private closureService: ClosureService) {
    this.closureForm = this.fb.group({
      exercise: [null, [Validators.required, Validators.min(2000)]],
      month: [null, [Validators.required, Validators.min(1), Validators.max(12)]]
    });
  }

  ngOnInit() {
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

  submit() {
    if (this.closureForm.invalid) return;
    this.loading = true;
    this.error = null;
    const formValue = this.closureForm.value;
    const request: ClosureRequest = {
      ...formValue,
      month: Number(formValue.month)
    };
    const action = this.closure ? this.closureService.updateClosure(request) : this.closureService.createClosure(request);
    action.subscribe({
      next: () => { this.loading = false; },
      error: (err) => {
        this.error = 'Erreur lors de la sauvegarde.';
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
