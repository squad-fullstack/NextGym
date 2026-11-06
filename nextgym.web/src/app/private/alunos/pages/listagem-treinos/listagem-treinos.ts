import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PlanoTreinoService, PlanoTreinoItem } from '../../../../core/services/plano-treino.service';
import { VinculoTreinoComponent, VinculoPayload, AlunoOption, PlanoTreinoOption } from '../../../../shared/vinculo-treinoAluno/vinculo-treinoAluno';
import { AlunoService } from '../../../../core/services/aluno.service';
import { VinculoService } from '../../../../core/services/vinculo.service';

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
  expandido?: boolean;
}

@Component({
  selector: 'app-listagem-treinos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, VinculoTreinoComponent],
  templateUrl: './listagem-treinos.html',
  styleUrls: ['./listagem-treinos.css']
})
export class ListagemTreinosComponent implements OnInit {
  private planoTreinoService = inject(PlanoTreinoService);
  private alunoService = inject(AlunoService);
  private cdr = inject(ChangeDetectorRef);
  private vinculoService = inject(VinculoService);

  termoBusca = '';
  filtroNivel = '';

  isLoading = false;
  errorMessage = '';

  treinos: TreinoViewModel[] = [];

  modalVinculoAberto = false;
  salvandoVinculo = false;
  
  listaAlunosOpcoes: AlunoOption[] = [];
  listaPlanosOpcoes: PlanoTreinoOption[] = [];

  ngOnInit(): void {
    this.carregarTreinos();
  }

  abrirModalVinculo(): void {
    this.carregarDadosParaModal();
    this.modalVinculoAberto = true;
    this.cdr.detectChanges(); 
  }

  fecharModalVinculo(): void {
    this.modalVinculoAberto = false;
    this.cdr.detectChanges(); 
  }

  private carregarDadosParaModal(): void {
    this.listaPlanosOpcoes = this.treinos.map(treino => ({
      id: treino.id,
      titulo: treino.nome
    }));

    this.alunoService.listarTodos().subscribe({
      next: (dados: any) => {
        const listaBruta = Array.isArray(dados) ? dados : (dados.content || dados.data || dados.alunos || []);
        
        this.listaAlunosOpcoes = listaBruta.map((aluno: any) => ({
          id: aluno.id,
          nome: aluno.nome
        }));
        
        this.cdr.detectChanges(); 
      },
      error: (err: any) => {
        console.error('Erro ao buscar alunos para o modal', err);
      }
    });
  }

  processarVinculo(payload: VinculoPayload): void {
    this.salvandoVinculo = true;
    console.log('A enviar dados para a API...', payload);

    this.vinculoService.vincular(payload).subscribe({
      next: (resposta) => {
        this.salvandoVinculo = false;
        this.fecharModalVinculo();
        
        alert('Plano de treino vinculado com sucesso!'); 
        this.cdr.detectChanges();
      },
      error: (erro) => {
        this.salvandoVinculo = false;
        console.error('Erro ao vincular plano:', erro);
        
        alert('Ocorreu um erro ao vincular o plano. Verifique a consola.');
        this.cdr.detectChanges();
      }
    });
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
          
          // Mapeando os alunos diretamente da resposta da API em vez dos dados de exemplo
          alunos: (item.alunosVinculados || []).map((aluno: any) => ({
            id: aluno.id,
            nome: aluno.nome,
            email: aluno.email,
            // Adicionado um fallback caso a API não retorne data de início nesta rota
            dataInicio: aluno.dataInicio ?? 'Não informada' 
          })),
          
          expandido: false 
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

  toggleExpandir(treino: TreinoViewModel): void {
    treino.expandido = !treino.expandido;
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