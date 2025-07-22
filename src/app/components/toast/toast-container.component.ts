import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ToastService } from './toast.service';
import { Toast } from './toast.types';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-toast-container',
  templateUrl: './toast-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastContainerComponent {
  toasts$: Observable<Toast[]> = this.toastService.toasts;

  constructor(private toastService: ToastService) {}

  dismiss(id: string) {
    this.toastService.dismiss(id);
  }
} 