import { Component, WritableSignal } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-server-check-renderer',
  imports: [ReactiveFormsModule],
  templateUrl: './server.input.check.component.html',
})
export class ServerInputCheckRendererComponent
  implements ICellRendererAngularComp
{
  public params!: ICellRendererParams;

  placeholder!: string;
  field!: string;
  form!: FormGroup;
  control!: FormControl;
  signal!: WritableSignal<any>;

  constructor() {}

  agInit(params: ICellRendererParams & { placeholder?: string }): void {
    this.params = params;
    this.field = params.colDef?.field!;
    this.placeholder = params.placeholder!;
    this.form = params.data.form;
    this.signal = params.data.signal;
    this.control = params.data.control! as FormControl;
  }

  refresh(params: ICellRendererParams): boolean {
    this.params = params;
    return true;
  }
}
