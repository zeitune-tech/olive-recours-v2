import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastContainerComponent } from './toast-container.component';
import { ToastComponent } from './toast.component';

@NgModule({
  declarations: [ToastContainerComponent, ToastComponent],
  imports: [CommonModule],
  exports: [ToastContainerComponent],
})
export class ToastModule {} 