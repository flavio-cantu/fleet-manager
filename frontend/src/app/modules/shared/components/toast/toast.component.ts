import { Component, EventEmitter } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ToastService } from '../../../../services/toast.service';

export enum ToastType {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
}

export interface ToastNotification {
  type: ToastType;
  message: string;
  id?: number;
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-position">
      @for (notification of list; track $index) { @if(notification.type ==
      'INFO'){
      <div class="alert alert-primary fw-bold" role="alert">
        <span class="bi bi-check-square me-2"></span>
        {{ notification.message }}
        <button
          class="btn exclude-alert"
          (click)="removeNotification(notification.id!)"
        >
          <span class="bi bi-chevron-double-right"></span>
        </button>
      </div>
      }@else if(notification.type == 'WARN'){
      <div class="alert alert-warning" role="alert">
        <span class="bi bi-exclamation-triangle-fill  me-2"></span>
        {{ notification.message }}
        <button
          class="btn exclude-alert"
          (click)="removeNotification(notification.id!)"
        >
          <span class="bi bi-chevron-double-right"></span>
        </button>
      </div>
      }@else if(notification.type == 'ERROR'){
      <div class="alert alert-danger" role="alert">
        <span class="bi bi-x-octagon-fill  me-2"></span>
        {{ notification.message }}
        <button
          class="btn exclude-alert"
          (click)="removeNotification(notification.id!)"
        >
          <span class="bi bi-chevron-double-right"></span>
        </button>
      </div>
      } }
    </div>
  `,
  styles: [
    `
      .toast-position {
        position: fixed;
        z-index: 1010;
        top: 10px;
        right: 10px;
      }

      .exclude-alert {
        float: right;
        margin-top: -7px;
        margin-left: 3px;
      }
    `,
  ],
})
export class ToastComponent {
  private static readonly CLEAR_TIME = 4000;

  private static TIME_MULTIPLIER = 1;

  notification: EventEmitter<ToastNotification> = new EventEmitter();

  list: ToastNotification[] = [];

  constructor(toastService: ToastService) {
    let nextId = 1;
    toastService.setNotification(this.notification);

    this.notification.subscribe((request: ToastNotification) => {
      request.id = nextId++;
      const exists = this.list.filter((r) => r.message === request.message);
      if (exists && exists.length != 0) {
        exists.forEach((item) => this.removeNotification(item.id!));
      }
      this.list.push(request);
      ToastComponent.TIME_MULTIPLIER += 0.5;

      setTimeout(() => {
        this.removeNotification(request.id!);
      }, ToastComponent.CLEAR_TIME * ToastComponent.TIME_MULTIPLIER);
    });
  }

  removeNotification(id: number) {
    this.list = this.list.filter((n) => n.id !== id);
    ToastComponent.TIME_MULTIPLIER -= 0.5;
    if (ToastComponent.TIME_MULTIPLIER < 1) {
      ToastComponent.TIME_MULTIPLIER = 1;
    }
  }
}
