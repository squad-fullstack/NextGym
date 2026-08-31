import { Routes } from '@angular/router';
import { LoginProfissionalComponent } from './private/auth/pages/login-Profissional/login-profissional';
import { AuthLayout } from './core/layouts/auth-layout/auth-layout';
import { CadastroProfissionalComponent } from './private/auth/pages/Cadastro-Profissional/cadastro-profissional';
import { authGuard } from './core/guards/auth-guard';
//import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: 'auth',
    //canActivate: [guestGuard],
    component: AuthLayout, 
    children: [
      { path: 'login', component: LoginProfissionalComponent },
      { path: 'cadastro', component: CadastroProfissionalComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  {
    path: 'matricula-aluno',
    canActivate: [authGuard],
    loadComponent: () => import('./private/home/pages/Matricula-Aluno/Matricula-Aluno').then(m => m.MatriculaAlunoComponent)
  },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/login' }
];

