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
    setTimeout(() => {
      this.dismissMessage();
    }, 3000);
  }

  dismissMessage() {
    this.messageSubject.next('');
  }
}
