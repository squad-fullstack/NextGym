import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';  
import { VinculoPayload } from '../../shared/vinculo-treinoAluno/vinculo-treinoAluno'; 

@Injectable({
  providedIn: 'root'
})
export class VinculoService {
  private http = inject(HttpClient);

  private readonly baseUrl = 'https://academia-api-0wxl.onrender.com/api/alunos-treino'; 

  vincular(payload: VinculoPayload): Observable<any> {
    return this.http.post<any>(this.baseUrl, payload);
  }
}