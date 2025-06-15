import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';

export const httpAuthInterceptor: HttpInterceptorFn = (request, next) => {
    const authService = inject(AuthService);
    // Obtenha o token do seu serviço de autenticação
    const token = authService.getToken();

    // Clone a requisição e adicione o header Authorization se o token existir
    if (token) {
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(request);
}

