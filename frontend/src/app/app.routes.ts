import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { WaitForApprovalPage } from './pages/error/406.page';
import { UnauthorizedPage } from './pages/error/403.page';
import { NotFoundPage } from './pages/error/404.page';


export const routes: Routes = [
  {
    path: "login",
    loadComponent: () => import("./pages/sign/signIn/signin.page").then((m) => m.SignInPage),
  },
  {
    path: "signup",
    loadComponent: () => import("./pages/sign/signUp/signup.page").then((m) => m.SignupPage),
  },
  {
    path: "spaceships",
    loadComponent: () =>
      import("./modules/fleet-manager/pages/fleet/fleet-list/fleet-list.page").then((m) => m.FleetListPage),
    canActivate: [AuthGuard],
  },
  {
    path: "spaceships/new",
    loadComponent: () =>
      import("./modules/fleet-manager/pages/fleet/fleet-form/fleet-form.page").then((m) => m.FleetFormPage),
    canActivate: [AuthGuard],
  },
  {
    path: "plugin",
    loadComponent: () =>
      import("./modules/fleet-manager/pages/plugin/plugin.page").then((m) => m.PluginPage),
    canActivate: [AuthGuard],
  },
  {
    path: "guild/users",
    loadComponent: () =>
      import("./modules/fleet-manager/pages/guild/user-list/user-list.page").then((m) => m.UserListPage),
    canActivate: [AdminGuard],
  },
  {
    path: "guild/fleet",
    loadComponent: () =>
      import("./modules/fleet-manager/pages/guild/fleet-list/guild-fleet-list.page").then((m) => m.GuildFleetListPage),
    canActivate: [AdminGuard],
  },
  {
    path: "",
    redirectTo: "/login",
    pathMatch: "full",
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
    redirectTo: '404'
  }
]


/*
export const routes: Routes = [
  {
      path: 'sped',
      loadChildren: () => import('./sped/sped.routes'),
  },
  { path: '', redirectTo: '/sped/escrituracao', pathMatch: 'full' }, 
//  { path: '**', redirectTo: '/' },


path: 'sped',
    loadChildren: () =>
      import('./sped/sped.module').then((m) => m.SpedModule),
    
];
*/