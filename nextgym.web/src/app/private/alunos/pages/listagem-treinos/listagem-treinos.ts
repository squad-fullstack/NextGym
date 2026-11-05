import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PlanoTreinoService } from '../../../../core/services/plano-treino.service';

export interface AlunoVinculado {
  id: number;
  nome: string;
  email: string;
  dataInicio: string;
}

export interface TreinoViewModel {
  id: number;
  nome: string;
  descricao: string;
  nivel: string;
  alunos: AlunoVinculado[];
}

@Component({
  selector: 'app-listagem-treinos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './listagem-treinos.html',
  styleUrls: ['./listagem-treinos.css']
})
export class ListagemTreinosComponent implements OnInit {
  private planoTreinoService = inject(PlanoTreinoService);
  private cdr = inject(ChangeDetectorRef);

  termoBusca = '';
  filtroNivel = '';

  isLoading = false;
  errorMessage = '';

  treinos: TreinoViewModel[] = [];

  ngOnInit(): void {
    this.carregarTreinos();
  }

  carregarTreinos(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.planoTreinoService.listar().subscribe({
      next: (dados: any) => {
        let listaBruta: any[] = [];

        if (Array.isArray(dados)) {
          listaBruta = dados;
        } else if (dados && Array.isArray(dados.planos)) {
          listaBruta = dados.planos;
        } else if (dados && Array.isArray(dados.planosTreino)) {
          listaBruta = dados.planosTreino;
        } else if (dados && Array.isArray(dados.content)) {
          listaBruta = dados.content;
        } else if (dados && Array.isArray(dados.data)) {
          listaBruta = dados.data;
        }

        this.treinos = listaBruta.map((item: any, index: number) => ({
          id: item.idPlanoTreino ?? item.id ?? index + 1,
          nome: item.titulo ?? item.nome ?? 'Sem Título',
          descricao: item.descricao ?? 'Sem descrição informada',
          nivel: this.formatarNivel(item.nivelRecomendado ?? item.nivel ?? ''),
          // TODO: trocar pelos alunos reais quando o VinculoService do Wendell estiver pronto
          alunos: this.alunosDeExemplo(index)
        }));

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erro ao carregar treinos da API:', err);
        this.isLoading = false;
        this.errorMessage = 'Não foi possível carregar os treinos da API.';
        this.cdr.detectChanges();
      }
    });
  }

  // DADOS DE EXEMPLO (temporário)
  private alunosDeExemplo(posicao: number): AlunoVinculado[] {
    const exemplos: AlunoVinculado[][] = [
      [
        { id: 1, nome: 'Maria Souza', email: 'maria@email.com', dataInicio: '01/11/2026' },
        { id: 2, nome: 'João Lima', email: 'joao@email.com', dataInicio: '03/11/2026' }
      ],
      [
        { id: 3, nome: 'Ana Costa', email: 'ana@email.com', dataInicio: '02/11/2026' }
      ]
    ];
    return exemplos[posicao] ?? [];
  }

  private formatarNivel(valor: string): string {
    const mapa: Record<string, string> = {
      NUNCA_TREINOU: 'Nunca Treinou',
      INICIANTE: 'Iniciante',
      INTERMEDIARIO: 'Intermediário',
      AVANCADO: 'Avançado',
      ATLETA: 'Atleta'
    };
    return mapa[String(valor).toUpperCase()] || valor;
  }

  get treinosFiltrados(): TreinoViewModel[] {
    const termo = (this.termoBusca || '').trim().toLowerCase();
    const filtro = (this.filtroNivel || '').trim().toLowerCase();

    return this.treinos.filter(treino => {
      const correspondeTexto =
        !termo ||
        treino.nome.toLowerCase().includes(termo) ||
        treino.descricao.toLowerCase().includes(termo);

      const correspondeNivel =
        !filtro ||
        treino.nivel.toLowerCase() === filtro;

      return Boolean(correspondeTexto && correspondeNivel);
    });
  }

  classeNivel(nivel: string | undefined): string {
    switch (nivel?.trim().toLowerCase()) {
      case 'iniciante':
        return 'nivel-iniciante';
      case 'intermediário':
      case 'intermediario':
        return 'nivel-intermediario';
      case 'avançado':
      case 'avancado':
        return 'nivel-avancado';
      case 'atleta':
        return 'nivel-atleta';
      default:
        return '';
    }
  }

  abrirPopupVincular(treino: TreinoViewModel): void {
    // TODO: abrir o popup_vincular do Wendell passando este treino
    alert(`Em breve: vincular aluno ao treino "${treino.nome}"`);
  }

  editarTreino(treino: TreinoViewModel): void {
    const novoNome = prompt('Digite o nome do treino:', treino.nome);
    if (novoNome === null || !novoNome.trim()) return;

    const novaDescricao = prompt('Digite os grupos musculares:', treino.descricao);
    if (novaDescricao === null || !novaDescricao.trim()) return;

    treino.nome = novoNome.trim();
    treino.descricao = novaDescricao.trim();
    alert('Treino atualizado com sucesso localmente!');
  }

  excluirTreino(treino: TreinoViewModel): void {
    const confirmar = confirm(`Tem certeza que deseja excluir "${treino.nome}"?`);
    if (!confirmar) return;

    this.planoTreinoService.excluir(treino.id).subscribe({
      next: () => {
        this.treinos = this.treinos.filter(item => item.id !== treino.id);
        this.cdr.detectChanges();
      },
      error: () => {
        this.treinos = this.treinos.filter(item => item.id !== treino.id);
        this.cdr.detectChanges();
      }
    });
  }
}