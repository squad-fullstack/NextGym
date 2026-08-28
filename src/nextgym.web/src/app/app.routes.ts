import { Routes } from '@angular/router';
import { LoginComponent } from './private/auth/pages/login/login';
import { CadastroAssistenteComponent } from './private/auth/pages/Cadastro-Assistente/Cadastro-Assistente';
import { MatriculaAlunoComponent } from './private/auth/pages/Matricula-Aluno/Matricula-Aluno';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/cadastro', component: CadastroAssistenteComponent },
  { path: 'matricula', component: MatriculaAlunoComponent },          
  { path: '**', redirectTo: 'auth/login' }                        
];