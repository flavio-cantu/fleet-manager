import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogConfig,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

export interface LoadingModalOptions {
  title: string;
  config?: MatDialogConfig;
}

@Component({
  selector: 'app-load-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, TranslateModule],
  templateUrl: './loagin.modal.component.html',
})
export class LoadModalComponent {
  constructor(
    public dialogRef: MatDialogRef<LoadModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LoadingModalOptions
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
