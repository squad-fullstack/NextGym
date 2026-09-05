import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface AuthResponse {
  token: string;
  tipo?: string;
  id?: number;
  nome?: string;
  email?: string;
  perfil?: string;
  registroAcademico?: string;
}

export interface LoginPayload {
  email: string;
  senha?: string;
}

export interface CadastroProfissionalPayload {
  nome: string;
  email: string;
  senha?: string;
  registroAcademico?: string;
  perfil?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'https://academia-api-0wxl.onrender.com';

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/funcionarios/login`, payload).pipe(
      tap((res) => {
        if (res?.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('usuario_nome', res.nome || '');
          localStorage.setItem('usuario_email', res.email || '');
          localStorage.setItem('usuario_perfil', res.perfil || '');
        }
      })
    );
  }

  cadastrarProfissional(payload: CadastroProfissionalPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/funcionarios`, payload).pipe(
      tap((res) => {
        if (res?.token) {
          localStorage.setItem('token', res.token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario_nome');
    localStorage.removeItem('usuario_email');
    localStorage.removeItem('usuario_perfil');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  // Alias caso algum outro ponto ainda use em português
  estaAutenticado(): boolean {
    return this.isAuthenticated();
  }
}