import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'cadastro-cliente',
    loadComponent: () =>
      import(
        './private/auth/pages/cadastro-cliente/cadastro-cliente.component'
      ).then((m) => m.CadastroClienteComponent),
  },
  {
    path: '',
    redirectTo: 'cadastro-cliente',
    pathMatch: 'full',
  },
];