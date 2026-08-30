import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'boas-vindas',
    loadComponent: () =>
      import('./private/auth/pages/boas-vindas/boas-vindas').then((m) => m.BoasVindas),
  },
  {
    path: 'cadastro-cliente',
    loadComponent: () =>
      import(
        './private/auth/pages/cadastro-cliente/cadastro-cliente.component'
      ).then((m) => m.CadastroClienteComponent),
  },
  {
    path: '',
    redirectTo: 'boas-vindas',
    pathMatch: 'full',
  },
]