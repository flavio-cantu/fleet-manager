import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import { BackendError } from '../../models/error.model';
import { ModalService } from '../../modules/shared/components/modal/modal.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const authService = inject(AuthService);
    const modalService = inject(ModalService);
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 406) {
                handleAuthError(router, authService, '/406');
            } else if (error.status === 403) {
                handleAuthError(router, authService, '/403');
            } else if (error.status === 401) {
                const backend = new BackendError();
                backend.frontErrors = ['ERROR.USER.NOTFOUND']
                return throwError(() => backend);
            } else if (error.status === 400) {
                return throwError(() => extractErrorMessage(modalService, error));
            }
            return throwError(() => error.error.error);
        })
    );
};

function handleAuthError(router: Router, authService: AuthService, path: string) {
    authService.deleteToken();
    router.navigate([path]);
}

function extractErrorMessage(modalService: ModalService, error: HttpErrorResponse): BackendError {
    if (error.error.warnings || error.error.errors) {
        const mappedError = error.error as BackendError;
        modalService.showError({
            title: 'MODAL.ERROR_TITLE',
            items: mappedError
        });
        return error.error;
    }

    return { errors: ['Erro na requisição. Tente novamente.'] };
}
