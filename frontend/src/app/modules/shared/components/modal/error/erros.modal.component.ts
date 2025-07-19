import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
  MatDialogConfig
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { TranslateModule } from '@ngx-translate/core';
import { BackendError } from '../../../../../models/error.model';

export interface ErrorModalOptions {
  title: string;
  items: BackendError;
  config?: MatDialogConfig;
}

@Component({
  selector: 'app-error-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatDividerModule, MatListModule, TranslateModule],
  styleUrls: ['../modal.scss'],
  templateUrl: "./erros.modal.component.html"
})
export class ErrorModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ErrorModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ErrorModalOptions
  ) { }


  onClose(): void {
    this.dialogRef.close();
  }
}