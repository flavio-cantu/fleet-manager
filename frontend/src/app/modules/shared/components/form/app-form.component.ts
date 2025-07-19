// input-field.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BackendError } from '../../../../models/error.model';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: "./app-form.component.html",
})
export class FormContainerComponent {
  @Input() submitting: boolean = false;
  @Input() charging: boolean = false;
  @Input() errorMessages?: BackendError | null | undefined;
  @Input() formTitle?: string;
  @Input() form!: FormGroup;
  @Input() submitTitle: string = 'COMMON.SUBMIT';
  @Input() backPath?: string;
  @Input() submit = () => { };

  constructor(private router: Router
  ) { }

  onSubmit() {
    this.submit();
  }

  back() {
    if (this.backPath) {
      this.router.navigate([this.backPath])
    }
  }


}