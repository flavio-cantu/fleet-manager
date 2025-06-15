// input-field.component.ts
import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl, ReactiveFormsModule, FormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TranslatorService } from '../../services/translator.service';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, FormsModule],
  template: `
    <div class="getFormClass()">
      @if (label && type != 'checkbox') {
      <label [for]="id">{{ label | translate }}</label>
      }
      <input
        [id]="id"
        [type]="type"
        [class]="inputClass"
        [class.is-invalid]="shouldShowErrors()"
        [formControl]="castControl()"
        [placeholder]="getPlaceholder()"
        [title]="getTitle()"
      />
      @if (label && type == 'checkbox') {
      <label class="ms-2 form-check-label" [for]="id">{{ label | translate }}</label>
      }
      
       @if (control && shouldShowErrors()) {
        <div class="invalid-feedback">
          @if (control.hasError('required')) {
            <span>{{ requiredMessage | translate }}</span>
          }
          @if (control.hasError('minlength')) {
            <span>{{ 'VALIDATE.MINIMUM' | translate }}: {{ control.getError('minlength').requiredLength }}</span>
          }
          @if (control.hasError('maxlength')) {
            <span>{{ 'VALIDATE.MAXIMUM' | translate }}: {{ control.getError('maxlength').requiredLength }}</span>
          }
          @if (control.hasError('email')) {
            <span>{{ 'VALIDATE.EMAIL' | translate }}</span>
          }
          @if (control.hasError('pattern')) {
            <span>{{ patternMessage | translate }}</span>
          }
        </div>
      }
      
      @if (helpText && !shouldShowErrors()) {
        <small [id]="id + '-help'" class="form-text text-muted">{{ helpText | translate}}</small>
      }
      
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFieldComponent),
      multi: true
    }
  ]
})
export class InputFieldComponent implements ControlValueAccessor {
  @Input() id: string = '';
  @Input() type: string = 'text';
  @Input() label: string = '';
  @Input() placeholder: string = "";
  @Input() title: string = '';
  @Input() helpText: string = '';
  @Input() inputClass: string = 'form-control';
  @Input() requiredMessage: string = 'VALIDATE.REQUIRED';
  @Input() patternMessage: string = 'VALIDATE.PATTERN';
  @Input() control: AbstractControl<any, any> | null = new FormControl();
  @Input() submitted: boolean = false;

  constructor(private translatorService: TranslatorService) { }


  // Implementação ControlValueAccessor
  onChange: any = () => { };
  onTouched: any = () => { };

  shouldShowErrors(): boolean {
    if (this.control) {
      return (this.submitted && this.control.invalid) ||
        ((this.control.touched || this.control.dirty) && this.control.invalid);
    } else {
      return false;
    }
  }

  getPlaceholder(): string {
    const key = this.placeholder ? this.placeholder : `${this.label}_PLACEHOLDER`;
    return this.translateKey(key);
  }

  getTitle() {
    const key = this.title ? this.title : `${this.label}_TITLE`;
    return this.translateKey(key);
  }

  translateKey(key: string): string {
    return this.translatorService.translate(key);
  }

  castControl(): FormControl {
    return this.control!! as FormControl;
  }

  writeValue(value: any): void {
    this.control!!.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.control!!.disable() : this.control!!.enable();
  }

  getFormClass(): string {
    if (this.type === 'checkbox') {
      return 'form-check'
    }
    return 'form-group'
  }
}