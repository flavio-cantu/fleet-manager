// input-field.component.ts
import { ChangeDetectorRef, Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl, ReactiveFormsModule, FormsModule, AbstractControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TranslatorService } from '../../../../services/translator.service';

@Component({
  selector: 'app-select-field',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    FormsModule],
  template: `
    <div class="getFormClass()">
      @if (label) {
       @if (getRequired()) {
          *
        }
        <label [for]="id">{{ label | translate }}:</label>
      }
      
      @if (list == null || list.length != 0) {
      <select class="form-select" 
        [class]="inputClass"
        [class.is-invalid]="shouldShowErrors()"
        [formControl]="castControl()"
        [title]="getTitle()">
        <option selected value=""> Selecione </option>
        <ng-content></ng-content>
      </select>
      }@else{
        <span class="select-spinner spinner-border spinner-border-sm me-2"></span>
      }
  
       @if (control && shouldShowErrors()) {
        <div class="invalid-feedback">
          @if (control.hasError('required')) {
            <span>{{ requiredMessage | translate }}</span>
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
      useExisting: forwardRef(() => InputSelectComponent),
      multi: true
    }
  ]
})
export class InputSelectComponent implements ControlValueAccessor {
  @Input() id: string = '';
  @Input() type: string = 'text';
  @Input() label: string = '';
  @Input() title: string = '';
  @Input() helpText: string = '';
  @Input() inputClass: string = 'form-control';
  @Input() requiredMessage: string = 'VALIDATE.REQUIRED';
  @Input() patternMessage: string = 'VALIDATE.PATTERN';
  @Input() control: AbstractControl<any, any> | null = new FormControl();
  @Input() submitted: boolean = false;
  @Input() list!: any[];

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

  getTitle() {
    const key = this.title ? this.title : `${this.label}_TITLE`;
    return this.translateKey(key);
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
    if (this.control && this.control.value !== value && value.length != 0) {
      this.control!!.setValue(value, { emitEvent: false });
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

  getFormClass(): string {
    if (this.type === 'checkbox') {
      return 'form-check'
    }
    return 'form-group'
  }
}