import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlanoTreinoPayload, TipoTreinoOpcao } from '../models/plano-treino.models';

@Injectable({ providedIn: 'root' })
export class PlanoTreinoService {
  private http = inject(HttpClient);
  private urlPlanos = 'COLOQUE_AQUI_O_ENDERECO_DO_POST_PLANO';
  private urlTipos = 'COLOQUE_AQUI_O_ENDERECO_DO_GET_TIPOS';

  listarTipos(): Observable<TipoTreinoOpcao[]> {
    return this.http.get<TipoTreinoOpcao[]>(this.urlTipos);
  }

  criar(dados: PlanoTreinoPayload): Observable<unknown> {
    return this.http.post(this.urlPlanos, dados);
  }
}