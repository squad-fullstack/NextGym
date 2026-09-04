import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aluno } from '../models/aluno.models';

@Injectable({
  providedIn: 'root'
})
export class AlunoService {
  private http = inject(HttpClient);
  private readonly API_URL = 'https://academia-api-0wxl.onrender.com/api/alunos'; 
  listarTodos(): Observable<Aluno[]> {
    return this.http.get<Aluno[]>(this.API_URL);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}