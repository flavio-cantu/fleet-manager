import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { TranslatorService } from '../translator.service';
import { CookieService } from '../cookie.service';
import { AuthService } from '../auth.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const authService = inject(AuthService);
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 406) {
                handleAuthError(router, authService, '/406');
            } else if (error.status === 403) {
                handleAuthError(router, authService, '/403');
            } else if (error.status === 400) {
                return throwError(() => extractErrorMessage(error));
            }
            return throwError(() => error.error.error);
        })
    );
};

function handleAuthError(router: Router, authService: AuthService, path: string) {
    authService.deleteToken();
    router.navigate([path]);
}

function extractErrorMessage(error: HttpErrorResponse): string {
    if (error.error?.code) {
        return error.error.code;
    }

    return 'Erro na requisição. Tente novamente.';
}
