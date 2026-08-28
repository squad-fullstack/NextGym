import { Routes } from '@angular/router';
import { LoginProfissionalComponent } from './private/auth/pages/login-Profissional/login-profissional';
import { AuthLayout } from './core/layouts/auth-layout/auth-layout';
import { CadastroProfissionalComponent } from './private/auth/pages/Cadastro-Profissional/cadastro-profissional';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayout, // O layout pai
    children: [
      { path: 'login', component: LoginProfissionalComponent },
      { path: 'cadastro', component: CadastroProfissionalComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/login' }
];