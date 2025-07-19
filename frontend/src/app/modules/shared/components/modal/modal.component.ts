// src/app/shared/modal/modal.component.ts
import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogConfig,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

export interface ModalOptions {
  title: string;
  content: string;
  actions?: ModalAction[];
  config?: MatDialogConfig;
}

export interface ModalAction {
  text: string;
  css?: 'btn-danger' | 'btn-primary' | 'btn-secondary';
  handler: (ref: MatDialogRef<ModalComponent>) => void;
}


@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, TranslateModule],
  styleUrls: ['modal.scss'],
  template: `
    <div class="modal" mat-dialog-title>
      <h2 >{{ data.title | translate}}</h2>
    </div>
    
    <mat-dialog-content>
        {{ data.content | translate}}
    </mat-dialog-content>
    
    <mat-dialog-actions align="end">
      @for (action of data.actions || []; track action.text) {
        <button 
          class="ms-2 btn {{action.css}}"
          (click)="handleAction(action)">
          {{ action.text | translate}}
        </button>
      }
    </mat-dialog-actions>

    <ng-template #contentTemplate let-context>
      <!-- Conteúdo dinâmico será injetado aqui -->
    </ng-template>
  `,
})
export class ModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalOptions
  ) { }

  handleAction(action: ModalAction) {
    action.handler(this.dialogRef);
  }
}