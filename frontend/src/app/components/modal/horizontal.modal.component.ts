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

export interface HorizonalModalItem {
  buttonText: string;
  buttonColor?: 'primary' | 'accent' | 'warn';
  buttonAction: (ref: MatDialogRef<HorizonalModalComponent>) => void;
}

export interface HorizonalModalOptions {
  title: string;
  items: HorizonalModalItem[];
  config?: MatDialogConfig;
}

@Component({
  selector: 'app-horizontal-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatDividerModule, MatListModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    
    <mat-dialog-content class="content-scroll">
      <div class="container text-center h-100">
      <div class="row">
        @for (item of data.items; track $index) {
            <div class="col" style="height: 50px;">
              <button 
                mat-flat-button 
                [color]="item.buttonColor || 'primary'"
                (click)="handleAction(item)">
                {{ item.buttonText }}
              </button>
            </div>
        }
            </div>
      </div>
    </mat-dialog-content>
    
    <mat-dialog-actions align="end">
      <button mat-button (click)="onClose()">Fechar</button>
    </mat-dialog-actions>
  `
})
export class HorizonalModalComponent {
  constructor(
    public dialogRef: MatDialogRef<HorizonalModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HorizonalModalOptions
  ) { }

  handleAction(item: HorizonalModalItem): void {
    item.buttonAction(this.dialogRef);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}