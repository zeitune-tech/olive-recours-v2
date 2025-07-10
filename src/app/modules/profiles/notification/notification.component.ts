import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
  message: string = '';

  constructor(private notificationService: NotificationService) {
    this.notificationService.message$.subscribe(message => {
      this.message = message;
    });
  }

  dismiss() {
    this.notificationService.dismissMessage();
  }
}
