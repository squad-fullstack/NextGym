import { Routes } from '@angular/router';
import { AuthLayout } from './core/layouts/auth-layout/auth-layout';
import { LoginComponent } from './private/auth/pages/login/login';
import { CadastroComponent } from './private/auth/pages/Cadastro-Assistente/Cadastro-Assistente';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayout,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'cadastro', component: CadastroComponent },
    ]
  },
  {
    path: '', 
    redirectTo: 'auth/login', 
    pathMatch: 'full' 
  },
  {
    path: '**',
    redirectTo: 'auth/login'
  },
];