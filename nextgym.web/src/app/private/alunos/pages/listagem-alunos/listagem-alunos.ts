import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Aluno } from '../../../../core/models/aluno.models';
import { AlunoService } from '../../../../core/services/aluno.service';
import { VinculoService } from '../../../../core/services/vinculo.service';
import { VinculoTreinoComponent, VinculoPayload, AlunoOption, PlanoTreinoOption } from '../../../../shared/vinculo-treinoAluno/vinculo-treinoAluno';
import { PlanoTreinoService } from '../../../../core/services/plano-treino.service';

@Component({
  selector: 'app-listagem-alunos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, VinculoTreinoComponent],
  templateUrl: './listagem-alunos.html',
  styleUrls: ['./listagem-alunos.css']
})
export class ListagemAlunoComponent implements OnInit {
  private alunoService = inject(AlunoService);
  private planoTreinoService = inject(PlanoTreinoService); 
  private cdr = inject(ChangeDetectorRef);
  private vinculoService = inject(VinculoService);

  alunos: Aluno[] = [];
  alunosFiltrados: Aluno[] = [];

  termoBusca: string = '';
  filtroPlano: string = '';

  isLoading: boolean = false;
  errorMessage: string = '';

  modalVinculoAberto = false;
  salvandoVinculo = false;
  
  listaAlunosOpcoes: AlunoOption[] = [];
  listaPlanosOpcoes: PlanoTreinoOption[] = [];

  ngOnInit(): void {
    this.carregarAlunos();
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
    this.listaAlunosOpcoes = this.alunos.map(aluno => ({
      id: (aluno.id as number), 
      nome: aluno.nome
    }));

    this.planoTreinoService.listar().subscribe({
      next: (dados: any) => {
        const listaBruta = Array.isArray(dados) ? dados : (dados.content || dados.planos || dados.data || []);
        
        this.listaPlanosOpcoes = listaBruta.map((plano: any) => ({
          id: plano.idPlanoTreino ?? plano.id,
          titulo: plano.titulo ?? plano.nome
        }));
        
        this.cdr.detectChanges(); 
      },
      error: (err: any) => {
        console.error('Erro ao buscar planos de treino para o modal:', err);
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

        this.carregarAlunos();
      },
      error: (erro) => {
        this.salvandoVinculo = false;
        console.error('Erro ao vincular plano:', erro);
        
        alert('Ocorreu um erro ao vincular o plano. Verifique a consola.');
        this.cdr.detectChanges();
      }
    });
  }

  carregarAlunos(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.alunoService.listarTodos().subscribe({
      next: (data: any) => {
        let lista: Aluno[] = [];

        if (Array.isArray(data)) {
          lista = data;
        } else if (data && Array.isArray(data.alunos)) {
          lista = data.alunos;
        } else if (data && Array.isArray(data.content)) {
          lista = data.content;
        } else if (data && Array.isArray(data.data)) {
          lista = data.data;
        }
      
        lista = lista.map((aluno: any) => {
          
          let nomeDoTreino = '';
          const origemTreino = aluno.nomeTreino || aluno.treinoAtual;

          if (origemTreino) {
            if (typeof origemTreino === 'object') {
              nomeDoTreino = origemTreino.nome || origemTreino.titulo || '';
            } else {
              nomeDoTreino = origemTreino;
            }
          }

          return {
            ...aluno,
            nomeTreino: nomeDoTreino
          };
        });


        this.alunos = lista;
        this.alunosFiltrados = [...lista];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Não foi possível carregar os alunos. Verifique se a API está online e autenticada.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  aplicarFiltros(): void {
    const termo = (this.termoBusca || '').trim().toLowerCase();
    const filtroNivel = (this.filtroPlano || '').trim().toUpperCase();

    if (!termo && !filtroNivel) {
      this.alunosFiltrados = [...this.alunos];
      this.cdr.detectChanges();
      return;
    }

    this.alunosFiltrados = this.alunos.filter((aluno: any) => {
      const nomeVal = String(aluno.nome || '').toLowerCase();
      const emailVal = String(aluno.email || '').toLowerCase();
      const telVal = String(aluno.telefone || '');

      const matchTexto = !termo || nomeVal.includes(termo) || emailVal.includes(termo) || telVal.includes(termo);

      const nivelBruto = String(aluno.nivelExperiencia || aluno.nivel || '').trim().toUpperCase();
      const matchNivel = !filtroNivel || nivelBruto === filtroNivel;

      return matchTexto && matchNivel;
    });

    this.cdr.detectChanges();
  }

  deletarAluno(id: number | undefined): void {
    if (!id) return;

    if (confirm('Tem certeza que deseja remover este aluno?')) {
      this.alunoService.excluir(id).subscribe({
        next: () => {
          this.alunos = this.alunos.filter((a) => a.id !== id);
          this.aplicarFiltros();
        },
        error: () => {
          alert('Erro ao excluir aluno.');
        }
      });
    }
  }

  obterClasseNivel(nivel: string): string {
  if (!nivel) return 'level-nunca-treinou';
  const nivelNormalizado = nivel.toUpperCase().trim();
  switch (nivelNormalizado) {
    case 'NUNCA_TREINOU':
    case 'NUNCA TREINOU':
      return 'level-nunca-treinou';
    case 'INICIANTE':
      return 'level-iniciante';
    case 'INTERMEDIARIO':
    case 'INTERMEDIÁRIO':
      return 'level-intermediario';
    case 'AVANCADO':
    case 'AVANÇADO':
      return 'level-avancado';
    case 'ATLETA':
      return 'level-atleta';
    default:
      return 'level-nunca-treinou';
  }
}

obterIniciais(nome: string): string {
    if (!nome) return '';
    const partes = nome.trim().split(' ').filter(Boolean);
    if (partes.length === 0) return '';
    if (partes.length === 1) {
      return partes[0].substring(0, 2).toUpperCase();
    }
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  }


  obterCorAvatar(nome: string): string {
    if (!nome) return '#e2e8f0';
    let hash = 0;
    for (let i = 0; i < nome.length; i++) {
      hash = nome.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Paleta de cores suaves e elegantes (tons pastéis/profissionais)
    const cores = [
      '#f1f5f9', '#fee2e2', '#fef3c7', '#ecfdf5', 
      '#e0f2fe', '#ede9fe', '#fce7f3', '#ccfbf1'
    ];
    const index = Math.abs(hash) % cores.length;
    return cores[index];
  }

  obterCorTextoAvatar(nome: string): string {
    if (!nome) return '#57616e';
    let hash = 0;
    for (let i = 0; i < nome.length; i++) {
      hash = nome.charCodeAt(i) + ((hash << 5) - hash);
    }
    const coresTexto = [
      '#334155', '#a85b5b', '#92400e', '#3f8571', 
      '#3488b5', '#5b21b6', '#a04368', '#115e59'
    ];
    const index = Math.abs(hash) % coresTexto.length;
    return coresTexto[index];
  }
  
}