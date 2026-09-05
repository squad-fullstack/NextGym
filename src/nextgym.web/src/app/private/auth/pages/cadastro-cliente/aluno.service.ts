import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlunoService {
  private apiUrl = 'https://academia-api-0wxl.onrender.com/Alunos';

  constructor(private http: HttpClient) {}

  cadastrar(aluno: any): Observable<any> {
    return this.http.post(this.apiUrl + '/cadastrar', aluno);
  }
}