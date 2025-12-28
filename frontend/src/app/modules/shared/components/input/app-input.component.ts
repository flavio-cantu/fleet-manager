import { Component, Input, forwardRef } from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormControl,
  ReactiveFormsModule,
  FormsModule,
  AbstractControl,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TranslatorService } from '../../../../services/translator.service';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    FormsModule,
    NgxMaskDirective,
  ],
  template: `
    <div class="form-group">
      @if (label) { @if (getRequired()) { * }
      <label [for]="id">{{ label | translate }}:</label>
      }
      <input
        [id]="id"
        [class]="inputClass"
        [mask]="mask"
        [dropSpecialCharacters]="dropSpecialCharacters"
        [type]="type"
        [class.is-invalid]="shouldShowErrors()"
        [formControl]="castControl()"
        [placeholder]="getPlaceholder()"
        [title]="getTitle()"
        [maxlength]="maxlength"
        [thousandSeparator]="thousandSeparator"
        [prefix]="prefix"
      />
      @if (control && shouldShowErrors()) {
      <div class="invalid-feedback">
        @if (control.hasError('required')) {
        <span>{{ requiredMessage | translate }}</span>
        } @if (control.hasError('minlength')) {
        <span
          >{{ 'VALIDATE.MINIMUM' | translate }}:
          {{ control.getError('minlength').requiredLength }}</span
        >
        } @if (control.hasError('maxlength')) {
        <span
          >{{ 'VALIDATE.MAXIMUM' | translate }}:
          {{ control.getError('maxlength').requiredLength }}</span
        >
        } @if (control.hasError('email')) {
        <span>{{ 'VALIDATE.EMAIL' | translate }}</span>
        } @if (control.hasError('pattern')) {
        <span>{{ patternMessage | translate }}</span>
        } @if (control.hasError('mask') || control.hasError('invalidCnpj')) {
        <span>{{ maskMessage | translate }}</span>
        } @if (control.hasError('invalidDate')) {
        <span>{{ 'VALIDATE.DATE' | translate }}</span>
        }
      </div>
      } @if (helpText && !shouldShowErrors()) {
      <small [id]="id + '-help'" class="form-text text-muted">{{
        helpText | translate
      }}</small>
      }
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFieldComponent),
      multi: true,
    },
  ],
})
export class InputFieldComponent implements ControlValueAccessor {
  @Input() id: string = '';
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() title: string = '';
  @Input() type = 'text';
  @Input() helpText: string = '';
  @Input() inputClass: string = 'form-control';
  @Input() maxlength: string = 'none';
  @Input() requiredMessage: string = 'VALIDATE.REQUIRED';
  @Input() patternMessage: string = 'VALIDATE.PATTERN';
  @Input() maskMessage: string = 'VALIDATE.MASK';
  @Input() mask: string = '';
  @Input() dropSpecialCharacters: boolean = true;
  @Input() control: AbstractControl<any, any> | null = new FormControl();
  @Input() submitted: boolean = false;
  @Input() thousandSeparator: string = '';
  @Input() prefix: string = '';

  titleValue?: string;

  //TODO pegar o tamanho do campo de dentro do controler e aplicar no size do input

  constructor(private translatorService: TranslatorService) {}

  // Implementação ControlValueAccessor
  onChange: any = () => {};
  onTouched: any = () => {};

  shouldShowErrors(): boolean {
    if (this.control) {
      return (
        (this.submitted && this.control.invalid) ||
        ((this.control.touched || this.control.dirty) && this.control.invalid)
      );
    } else {
      return false;
    }
  }

  getPlaceholder(): string {
    const key = this.placeholder
      ? this.placeholder
      : `${this.label}_PLACEHOLDER`;
    return this.translateKey(key);
  }

  getTitle() {
    if (!this.titleValue) {
      var key = this.placeholder
        ? this.placeholder
        : `${this.label}_PLACEHOLDER`;
      this.titleValue = this.translateKey(key);
      if (!this.titleValue) {
        key = this.title ? this.title : `${this.label}_TITLE`;
        this.titleValue = this.translateKey(key);
      }
    }
    return this.titleValue;
  }

  getRequired() {
    const control = this.castControl();
    if (control) {
      return control?.hasValidator(Validators.required);
    }
    return false;
  }

  translateKey(key: string): string {
    return this.translatorService.translate(key);
  }

  castControl(): FormControl {
    return this.control!! as FormControl;
  }

  writeValue(value: any): void {
    if (this.control && this.control.value !== value) {
      this.control.setValue(value, { emitEvent: false });
    }
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
}
