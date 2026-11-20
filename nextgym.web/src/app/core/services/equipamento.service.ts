import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Equipamento {
  id: number;
  nome: string;
  categoria: string;
  descricao: string;
  ativo: boolean;
  criadoEm: string;
}

export interface ListaEquipamentosResposta {
  equipamentos: Equipamento[];
  totalRegistros: number;
}

@Injectable({ providedIn: 'root' })
export class EquipamentoService {
  private http = inject(HttpClient);

  private readonly baseUrl = 'https://academia-api-0wxl.onrender.com/api/equipamentos';

  listar(): Observable<ListaEquipamentosResposta> {
    return this.http.get<ListaEquipamentosResposta>(this.baseUrl);
  }
}