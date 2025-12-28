import { Routes } from '@angular/router';
import { WaitForApprovalPage } from './pages/error/406.page';
import { UnauthorizedPage } from './pages/error/403.page';
import { NotFoundPage } from './pages/error/404.page';
import { AuthGuard } from './services/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'client/new',
    loadComponent: () =>
      import('./modules/manager/pages/example/form/form-example.page').then(
        (m) => m.ExampleFormPage
      ),
      canActivate: [AuthGuard],
  },
  {
    path: 'client/:id',
    loadComponent: () =>
      import('./modules/manager/pages/example/form/form-example.page').then(
        (m) => m.ExampleFormPage
      ),
      canActivate: [AuthGuard],
  },
  {
    path: 'client',
    loadComponent: () =>
      import('./modules/manager/pages/example/list/list-example.page').then(
        (m) => m.ExampleListPage
      ),
      canActivate: [AuthGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./modules/login/pages/form/form-login.page').then(
        (m) => m.LoginFormPage
      ),
  },
  {
    path: '',
    redirectTo: '/client',
    pathMatch: 'full',
  },
  {
    path: '403',
    component: UnauthorizedPage,
  },
  {
    path: '404',
    component: NotFoundPage,
  },

  {
    path: '406',
    component: WaitForApprovalPage,
  },
  // Redirecionar para 404 quando a rota não existe
  {
    path: '**',
    redirectTo: '404',
  },
];
