import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlanoTreinoPayload, TipoTreinoOpcao } from '../models/plano-treino.models';

export interface PlanoTreinoItem {
  id?: number;
  id_plano_treino?: number;
  titulo?: string;
  nome?: string;
  descricao: string;
  nivelRecomendado?: string;
  nivel?: string;
  idTipoTreino?: number;
  idProfessorCriador?: number;
  status?: string;
}

@Injectable({ providedIn: 'root' })
export class PlanoTreinoService {
  private http = inject(HttpClient);
  
  private readonly baseUrl = 'https://academia-api-0wxl.onrender.com/api/planos-treino';
  private readonly urlTipos = 'https://academia-api-0wxl.onrender.com/api/tipos-treino';

  listar(): Observable<PlanoTreinoItem[]> {
    return this.http.get<PlanoTreinoItem[]>(this.baseUrl);
  }

  criar(dados: PlanoTreinoPayload): Observable<unknown> {
    return this.http.post(this.baseUrl, dados);
  }

  listarTipos(): Observable<TipoTreinoOpcao[]> {
    return this.http.get<TipoTreinoOpcao[]>(this.urlTipos);
  }

  excluir(id: number): Observable<unknown> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}