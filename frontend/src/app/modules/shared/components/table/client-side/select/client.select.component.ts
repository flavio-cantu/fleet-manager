import { Component, WritableSignal } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputSelectComponent } from '../../../input/app-select.component';

@Component({
  selector: 'app-client-actions-renderer',
  imports: [InputSelectComponent, ReactiveFormsModule],
  templateUrl: './client.select.component.html',
})
export class ClientSelectRendererComponent implements ICellRendererAngularComp {
  public params!: ICellRendererParams;

  placeholder!: string;
  field!: string;
  form!: FormGroup;
  control!: FormControl;

  list!: any[];
  label!: string;
  value!: string;

  constructor() {}

  agInit(params: ICellRendererParams & { label: string; value: string }): void {
    this.params = params;
    this.field = params.colDef?.field!;
    this.form = params.data.form;
    this.list = params.data.list;
    this.label = params.label!;
    this.value = params.value!;
    this.control = params.data.control as FormControl;
  }

  refresh(params: ICellRendererParams): boolean {
    this.params = params;
    return true;
  }
}
