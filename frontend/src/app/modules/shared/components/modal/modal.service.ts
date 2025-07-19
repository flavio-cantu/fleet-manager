// src/app/shared/modal/modal.service.ts
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent, ModalOptions, } from './modal.component';
import { Observable } from 'rxjs';
import { BaseModalComponent, BaseModalOptions } from './base.modal.component';
import { ErrorModalComponent, ErrorModalOptions } from './error/erros.modal.component';

@Injectable({
    providedIn: 'root'
})
export class ModalService {
    constructor(private dialog: MatDialog) { }

    withOptions(options: ModalOptions): Observable<any> {
        const defaultConfig = {
            width: '500px',
            disableClose: true,
            ...options.config
        };

        const dialogRef = this.dialog.open(ModalComponent, {
            ...defaultConfig,
            data: {
                title: options.title,
                content: options.content,
                actions: options.actions || []
            }
        });

        return dialogRef.afterClosed();
    }

    // Método rápido para confirmação simples
    confirm(title: string, message: string): Observable<boolean> {
        return this.withOptions({
            title,
            content: message,
            actions: [
                {
                    text: 'MODAL.CANCEL',
                    css: 'btn-secondary',
                    handler: dialogRef => dialogRef.close(false)
                },
                {
                    text: 'MODAL.CONFIRM',
                    css: 'btn-primary',
                    handler: dialogRef => dialogRef.close(true)
                }
            ],
            config: { disableClose: false }
        });
    }

    delete(title: string, message: string): Observable<boolean> {
        return this.withOptions({
            title,
            content: message,
            actions: [
                {
                    text: 'MODAL.CANCEL',
                    css: 'btn-secondary',
                    handler: dialogRef => dialogRef.close(false)
                },
                {
                    text: 'MODAL.CONFIRM',
                    css: 'btn-danger',
                    handler: dialogRef => dialogRef.close(true)
                }
            ],
            config: { disableClose: false }
        });
    }

    alert(title: string, message: string): Observable<boolean> {
        return this.withOptions({
            title,
            content: message,
            actions: [
                {
                    text: 'Fechar',
                    handler: dialogRef => dialogRef.close(false)
                }
            ],
            config: { disableClose: false }
        });
    }

    show(options: BaseModalOptions): Observable<void> {
        const defaultConfig = {
            width: '450px',
            maxHeight: '80vh', // Altura máxima como 80% da viewport
            panelClass: 'bootstrap-style-dialog',
            disableClose: true,
            ...options.config
        };

        const dialogRef = this.dialog.open(BaseModalComponent, {
            ...defaultConfig,
            data: options
        });

        return dialogRef.afterClosed();
    }

    showError(options: ErrorModalOptions): Observable<void> {
        const defaultConfig = {
            width: '45rem',
            maxWidth: '45rem',
            maxHeight: '80vh', // Altura máxima como 80% da viewport
            panelClass: 'bootstrap-style-dialog',
            disableClose: true,
            ...options.config
        };

        const dialogRef = this.dialog.open(ErrorModalComponent, {
            ...defaultConfig,
            data: options
        });

        return dialogRef.afterClosed();
    }

}