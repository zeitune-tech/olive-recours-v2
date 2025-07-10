import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private messageSubject = new BehaviorSubject<string>('');
  message$ = this.messageSubject.asObservable();

  showMessage(message: string) {
    this.messageSubject.next(message);
  }

  dismissMessage() {
    this.messageSubject.next('');
  }
}
