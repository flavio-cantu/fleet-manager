// input-field.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './app-search.component.html',
})
export class SearchContainerComponent implements OnInit {
  @Input() submitting: boolean = false;
  @Input() charging: boolean = false;
  @Input() form!: FormGroup;
  @Input() submitTitle: string = 'COMMON.SEARCH';
  @Input() submit = () => {};
  @Input() showSubmitButton = true;

  defaultState: any;

  constructor() {}

  ngOnInit(): void {
    this.defaultState = this.form.value;
  }

  onSubmit() {
    this.submit();
  }

  clear() {
    this.form.reset();
    this.form.setValue(this.defaultState);
  }
}
