// src/app/shared/modal/modal.service.ts
import { EventEmitter, Injectable } from '@angular/core';
import {
  ToastNotification,
  ToastType,
} from '../modules/shared/components/toast/toast.component';
import { TranslatorService } from './translator.service';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private notification?: EventEmitter<ToastNotification>;

  constructor(private translatorService: TranslatorService) {}

  setNotification(emitter: EventEmitter<ToastNotification>) {
    this.notification = emitter;
  }

  private pushNotification(type: ToastType, message: string) {
    this.notification!.emit({
      type: type,
      message: message,
    });
  }

  pushBackendError(message: string) {
    this.pushNotification(ToastType.ERROR, message);
  }

  pushFrontendError(message: string) {
    this.pushNotification(
      ToastType.ERROR,
      this.translatorService.translate(message)
    );
  }

  pushWarning(message: string) {
    this.pushNotification(
      ToastType.WARN,
      this.translatorService.translate(message)
    );
  }

  pushInfo(message: string) {
    this.pushNotification(
      ToastType.INFO,
      this.translatorService.translate(message)
    );
  }

  pushCustomInfo(message: string) {
    this.pushNotification(ToastType.INFO, message);
  }
}
