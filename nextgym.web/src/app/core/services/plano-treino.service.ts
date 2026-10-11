import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlanoTreinoPayload, TipoTreinoOpcao } from '../models/plano-treino.models';

@Injectable({ providedIn: 'root' })
export class PlanoTreinoService {
  private http = inject(HttpClient);
  private urlPlanos = 'https://academia-api-0wxl.onrender.com/api/planos-treino';
  private urlTipos = 'https://academia-api-0wxl.onrender.com/api/tipos-treino';

  listarTipos(): Observable<TipoTreinoOpcao[]> {
    return this.http.get<TipoTreinoOpcao[]>(this.urlTipos);
  }

  criar(dados: PlanoTreinoPayload): Observable<unknown> {
    return this.http.post(this.urlPlanos, dados);
  }
}