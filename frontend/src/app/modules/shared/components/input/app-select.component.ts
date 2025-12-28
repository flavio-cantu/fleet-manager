import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  forwardRef,
} from '@angular/core';
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
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-select-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    FormsModule,
    NgSelectModule,
  ],
  template: `
    <div class="form-group">
      @if (label) { @if (getRequired()) { * }
      <label [for]="id" [title]="getTitle()">{{ label | translate }}:</label>
      } @if (lazyLoad || (list == null || list.length != 0)) {
      <ng-select
        [style]="style"
        [id]="id"
        [class]="inputClass"
        [class.is-invalid]="shouldShowErrors()"
        [formControl]="castControl()"
        [title]="getTitle()"
        [items]="list"
        [multiple]="multiple"
        [appendTo]="modalMode"
        [bindLabel]="bindLabel"
        [bindValue]="bindValue"
        [placeholder]="placeholder"
        [notFoundText]="notFound"
      >
      </ng-select>
      }@else{
      <span class="select-spinner spinner-border spinner-border-sm me-2"></span>
      } @if (control && shouldShowErrors()) {
      <div class="invalid-feedback">
        @if (control.hasError('required')) {
        <span>{{ requiredMessage | translate }}</span>
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
      useExisting: forwardRef(() => InputSelectComponent),
      multi: true,
    },
  ],
})
export class InputSelectComponent implements ControlValueAccessor {
  @Input() id: string = '';
  @Input() type: string = 'text';
  @Input() label: string = '';
  @Input() title: string = '';
  @Input() helpText: string = '';
  @Input() inputClass: string = 'form-control select-control';
  @Input() requiredMessage: string = 'VALIDATE.REQUIRED';
  @Input() patternMessage: string = 'VALIDATE.PATTERN';
  @Input() control: AbstractControl<any, any> | null = new FormControl();
  @Input() submitted: boolean = false;
  @Input() list!: any[];
  @Input() bindLabel: string = 'label';
  @Input() bindValue: string = 'value';
  @Input() defaultOption = 'Selecione';
  @Input() lazyLoad: boolean = false;
  @Input() setModalMode: boolean = false;
  @Input() multiple: boolean = false;
  @Input() style: any;
  constructor(private translatorService: TranslatorService) {
    setTimeout(() => {
      if (!this.list || this.list.length == 0) {
        this.lazyLoad = true;
      }
    }, 10000);
  }

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

  getTitle() {
    if (this.label) {
      const key = this.title ? this.title : `${this.label}_TITLE`;
      return this.translateKey(key);
    }
    return '';
  }

  getRequired() {
    const control = this.castControl();
    if (control) {
      return control?.hasValidator(Validators.required);
    }
    return false;
  }

  get placeholder() {
    if (this.castControl().value || this.castControl().value == 0) {
      return '';
    }
    return this.defaultOption;
  }

  get notFound() {
    return this.translateKey('COMPONENT.NO_ITEM');
  }

  get modalMode() {
    if (this.setModalMode) {
      return 'body';
    }
    return '';
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
    //ng-select pega do control e toma conta
  }
}
