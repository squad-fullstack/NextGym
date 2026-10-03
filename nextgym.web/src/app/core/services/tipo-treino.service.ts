import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoTreino } from '../models/tipo-treino.models';

@Injectable({ providedIn: 'root' })
export class TipoTreinoService {
  private http = inject(HttpClient);
  private apiUrl = 'COLOQUE_AQUI_O_ENDERECO';

  criar(dados: TipoTreino): Observable<TipoTreino> {
    return this.http.post<TipoTreino>(this.apiUrl, dados);
  }
}