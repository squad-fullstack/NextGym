import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface CadastroProfissionalPayload {
  nome: string;
  cref: string;
  email: string;
  senha: string;
}

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/auth';

  cadastrarProfissional(payload: CadastroProfissionalPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/cadastro/profissional`, payload).pipe(
      tap(response => {
        if (response?.token) {
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap(response => {
        if (response?.token) {
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}