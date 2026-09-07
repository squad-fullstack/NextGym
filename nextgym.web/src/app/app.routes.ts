import { Routes } from '@angular/router';
import { AuthLayout } from './core/layouts/auth-layout/auth-layout';
import { LoginProfissionalComponent } from './private/auth/pages/login-Profissional/login-profissional';
import { CadastroProfissionalComponent } from './private/auth/pages/cadastro-profissional/cadastro-profissional';
import { authGuard } from './core/guards/auth-guard';
import { SidebarComponent } from './core/layouts/sidebar/sidebar';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },

  {
    path: 'auth',
    component: AuthLayout,
    children: [
      { path: 'login', component: LoginProfissionalComponent },
      { path: 'cadastro/profissional', component: CadastroProfissionalComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },

  {
    path: '',
    component: SidebarComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./private/home/pages/tela-inicial/tela-inicial').then(m => m.TelaInicialComponent)
      },
      {
        path: 'alunos',
        children: [
          {
            path: 'listagem-alunos',
            loadComponent: () => import('./private/alunos/pages/listagem-alunos/listagem-alunos').then(m => m.ListagemAlunoComponent)
          },
          {
            path: 'cadastro-aluno',
            loadComponent: () => import('./private/alunos/pages/matricula-aluno/matricula-aluno').then(m => m.MatriculaAlunoComponent)
          },
          {
            path: '',
            redirectTo: 'listagem-alunos',
            pathMatch: 'full'
          }
        ]
      }
    ]
  },

  { 
    path: '**', 
    redirectTo: 'home' 
  }
];