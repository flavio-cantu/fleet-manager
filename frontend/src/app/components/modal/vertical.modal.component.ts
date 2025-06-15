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

export interface VerticalModalItem {
  label: string;
  value?: string;
  buttonText: string;
  buttonColor?: 'primary' | 'accent' | 'warn';
  buttonAction: (ref: MatDialogRef<VerticalModalComponent>) => void;
}

export interface VerticalModalOptions {
  title: string;
  items: VerticalModalItem[];
  config?: MatDialogConfig;
}

@Component({
  selector: 'app-vertical-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatDividerModule, MatListModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    
    <mat-dialog-content class="content-scroll">
      <div class="scrollable-list">
        @for (item of data.items; track item.label) {
          <div class="row mb-3">
            <div class="col">
              <div class="label">{{ item.label }}</div>
              @if (item.value) {
                <div class="value">{{ item.value }}</div>
              }
              <button 
                mat-flat-button 
                [color]="item.buttonColor || 'primary'"
                (click)="handleAction(item)">
                {{ item.buttonText }}
              </button>
            </div>
          </div>
          @if (!$last) {
            <mat-divider></mat-divider>
          }
        }
      </div>
    </mat-dialog-content>
    
    <mat-dialog-actions align="end">
      <button mat-button (click)="onClose()">Fechar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .content-scroll {
      overflow-y: auto;
      max-height: calc(80vh - 130px); /* Ajuste baseado no título e ações */
      padding: 0 24px;
    }
    
    .scrollable-list {
      padding-top: 0;
    }
    
    .vertical-modal-item {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 8px;
      padding: 12px 0;
      min-height: 80px; /* Altura mínima para cada item */
    }
    
    .label {
      font-weight: 500;
      color: rgba(0, 0, 0, 0.87);
    }
    
    .value {
      color: rgba(0, 0, 0, 0.6);
      margin-bottom: 8px;
    }
  `]
})
export class VerticalModalComponent {
  constructor(
    public dialogRef: MatDialogRef<VerticalModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VerticalModalOptions
  ) { }

  handleAction(item: VerticalModalItem): void {
    item.buttonAction(this.dialogRef);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}