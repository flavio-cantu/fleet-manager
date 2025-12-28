import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ModalService } from '../../modules/shared/components/modal/modal.service';
import { BackendError } from '../../models/domain/error.model';
import { AuthHolder } from '../auth/auth.holder';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const modalService = inject(ModalService);
  const authHolder = inject(AuthHolder);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 406) {
        handleAuthError(router, '/406');
      } else if (error.status === 401 || error.status === 0) {
        authHolder.logout();
        handleAuthError(router, '/login');
      } else if (error.status === 403 || error.status === 0) {
        handleAuthError(router, '/403');
      } else if (error.status === 400 || error.status === 500) {
        return throwError(() => extractErrorMessage(modalService, error));
      }
      return throwError(() => `${error.error.status}`);
    })
  );
};

function handleAuthError(router: Router, path: string) {
  router.navigate([path]);
}

function extractErrorMessage(modalService: ModalService, error: HttpErrorResponse): BackendError {
  if (error.error.warnings || error.error.errors) {
    const mappedError = error.error as BackendError;
    modalService.showError({
      title: 'MODAL.ERROR_TITLE',
      items: mappedError,
    });
    return error.error;
  }

  return {
    errors: ['500'],
  };
}
