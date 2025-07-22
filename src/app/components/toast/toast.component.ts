import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Toast } from './toast.types';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  @Input() toast!: Toast;
  @Output() dismiss = new EventEmitter<void>();

  get typeClass() {
    switch (this.toast.type) {
      case 'success': return 'bg-green-500 text-white';
      case 'info': return 'bg-blue-500 text-white';
      case 'error': return 'bg-red-500 text-white';
      case 'primary': return 'bg-primary text-white';
      case 'accent': return 'bg-accent text-white';
      case 'warn': return 'bg-yellow-500 text-black';
      case 'secondary': return 'bg-gray-700 text-white';
      default: return 'bg-gray-800 text-white';
    }
  }
} 