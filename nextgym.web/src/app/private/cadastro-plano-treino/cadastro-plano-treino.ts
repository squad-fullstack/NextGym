import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PlanoTreinoService } from '../../core/services/plano-treino.service';
import { Equipamento, EquipamentoService } from '../../core/services/equipamento.service';
import { NIVEIS_RECOMENDADOS, TipoTreinoOpcao, PlanoTreinoPayload } from '../../core/models/plano-treino.models';

export enum TipoTreinoEnum {
  CALISTENIA = 1,
  HIPERTROFIA = 2,
  EMAGRECIMENTO = 3
}

export const TIPOS_TREINO_PADRAO: TipoTreinoOpcao[] = [
  {
    id: TipoTreinoEnum.CALISTENIA,
    nome: 'Calistenia',
    descricao: 'Treinos focados no peso corporal e domínio do movimento'
  },
  {
    id: TipoTreinoEnum.HIPERTROFIA,
    nome: 'Hipertrofia',
    descricao: 'Treinos voltados para hipertrofia e ganho de massa'
  },
  {
    id: TipoTreinoEnum.EMAGRECIMENTO,
    nome: 'Emagrecimento',
    descricao: 'Treinos com foco em queima calórica e condicionamento'
  }
];

@Component({
  selector: 'app-cadastro-plano-treino',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './cadastro-plano-treino.html',
  styleUrls: ['./cadastro-plano-treino.css']
})
export class CadastroPlanoTreinoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private planoTreinoService = inject(PlanoTreinoService);
  private equipamentoService = inject(EquipamentoService);
  private cdr = inject(ChangeDetectorRef);

  readonly LIMITE_TITULO = 100;
  readonly LIMITE_DESCRICAO = 250;

  niveis = NIVEIS_RECOMENDADOS;
  tipos: TipoTreinoOpcao[] = TIPOS_TREINO_PADRAO;

  equipamentosDisponiveis: Equipamento[] = [];
  equipamentosFiltrados: Equipamento[] = [];
  equipamentosSelecionados: number[] = [];
  buscaEquipamento = '';
  carregandoEquipamentos = false;
  erroEquipamentos = '';

  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  form: FormGroup = this.fb.group({
    tipoTreino: ['', [Validators.required]],
    titulo: ['', [Validators.required, Validators.maxLength(this.LIMITE_TITULO)]],
    descricao: ['', [Validators.required, Validators.maxLength(this.LIMITE_DESCRICAO)]],
    nivelRecomendado: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.carregarTiposTreino();
    this.carregarEquipamentos();
  }

  private carregarTiposTreino(): void {
    this.planoTreinoService.listarTipos().subscribe({
      next: (lista) => {
        if (lista && lista.length > 0) {
          this.tipos = lista;
          this.cdr.detectChanges();
        }
      },
      error: (err: any) => {
        console.warn('API indisponível, utilizando tipos padrão locais:', err);
      }
    });
  }

  carregarEquipamentos(): void {
    this.carregandoEquipamentos = true;
    this.erroEquipamentos = '';

    this.equipamentoService.listar().subscribe({
      next: (resposta) => {
        const lista = (resposta?.equipamentos ?? []).filter((e) => e.ativo);
        this.equipamentosDisponiveis = lista;
        this.equipamentosFiltrados = [...lista];
        this.carregandoEquipamentos = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.erroEquipamentos = 'Não foi possível carregar os equipamentos.';
        this.carregandoEquipamentos = false;
        this.cdr.detectChanges();
      }
    });
  }

  filtrarEquipamentos(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.buscaEquipamento = input.value;
    const termo = this.buscaEquipamento.trim().toLowerCase();

    this.equipamentosFiltrados = this.equipamentosDisponiveis.filter((eq) =>
      String(eq.nome || '').toLowerCase().includes(termo) ||
      String(eq.categoria || '').toLowerCase().includes(termo)
    );
  }

  toggleEquipamento(id?: number): void {
    if (id == null) return;

    const numId = Number(id);
    const jaSelecionado = this.equipamentosSelecionados.includes(numId);

    this.equipamentosSelecionados = jaSelecionado
      ? this.equipamentosSelecionados.filter((item) => item !== numId)
      : [...this.equipamentosSelecionados, numId];
  }

  isEquipamentoSelecionado(id?: number): boolean {
    return id != null && this.equipamentosSelecionados.includes(Number(id));
  }

  idDoTipo(tipo: TipoTreinoOpcao): number {
    return tipo.id_tipo_treino ?? tipo.id;
  }

  get totalTitulo(): number {
    return (this.form.get('titulo')?.value || '').length;
  }

  get totalDescricao(): number {
    return (this.form.get('descricao')?.value || '').length;
  }

  campoInvalido(campo: string): boolean {
    const control = this.form.get(campo);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  obterMensagemErro(campo: string): string {
    const control = this.form.get(campo);
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'Campo obrigatório.';
    if (control.errors['maxlength']) {
      return `Máximo de ${control.errors['maxlength'].requiredLength} caracteres.`;
    }

    return 'Valor inválido.';
  }

  voltarParaListagem(): void {
    this.router.navigate(['/treinos/listagem-treinos']);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const idProfessor = Number(
      localStorage.getItem('usuario_id') ||
      localStorage.getItem('id') ||
      localStorage.getItem('userId')
    );

    if (!idProfessor || isNaN(idProfessor)) {
      this.errorMessage = 'Não foi possível identificar o professor autenticado. Faça login novamente.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload: PlanoTreinoPayload = {
      idTipoTreino: Number(this.form.value.tipoTreino),
      idProfessorCriador: idProfessor,
      titulo: this.form.value.titulo.trim(),
      descricao: this.form.value.descricao.trim(),
      nivelRecomendado: this.form.value.nivelRecomendado,
      equipamentosIds: this.equipamentosSelecionados
    };

    this.planoTreinoService.criar(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Plano de treino cadastrado com sucesso!';
        this.form.reset({ tipoTreino: '', titulo: '', descricao: '', nivelRecomendado: '' });
        this.equipamentosSelecionados = [];
        this.buscaEquipamento = '';

        this.router.navigate(['/treinos/listagem-treinos']);
      },
      error: (err: any) => {
        console.error('Erro ao cadastrar plano de treino:', err);
        this.isSubmitting = false;
        this.errorMessage =
          err?.error?.mensagem ||
          err?.error?.message ||
          err?.error?.erro ||
          'Erro ao cadastrar plano de treino. Verifique os dados preenchidos.';
        this.cdr.detectChanges();
      }
    });
  }
}