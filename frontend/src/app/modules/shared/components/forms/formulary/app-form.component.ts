// input-field.component.ts
import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BackendError } from '../../../../../models/domain/error.model';
import { ApiService } from '../../../../../services/api.base.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './app-form.component.html',
})
export class FormularyContainerComponent {
  @Input() submitting: boolean = false;
  @Input() charging: boolean = false;
  @Input() errorMessages?: BackendError | null | undefined;
  @Input() formTitle: string = 'TITLE';
  @Input() form!: FormGroup;
  @Input() submitTitle: string = 'COMMON.SUBMIT';
  @Input() backPath?: string;
  @Input() submit = () => {};
  @Input() hideSubmit = false;

  constructor(private router: Router, private apiService: ApiService) {}

  onSubmit() {
    this.submit();
  }

  back() {
    if (this.backPath) {
      this.router.navigate([this.backPath]);
    }
  }

  onSwitchChange(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.apiService.toggleEdfOFF(true);
    } else {
      this.apiService.toggleEdfOFF(false);
    }
  }
}
