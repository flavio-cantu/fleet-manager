import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: "root",
})
export class TranslatorService {

  constructor(private translateService: TranslateService) {
  }

  translate(code: string) {
    if (code) {
      const message = this.translateService.instant(code);
      if (code === message) {
        console.warn(`Key without match: ${code}`);
      }
      return message;
    }
  }

}