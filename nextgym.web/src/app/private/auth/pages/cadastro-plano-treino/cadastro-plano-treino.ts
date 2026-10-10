import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlanoTreinoService } from '../../../../core/services/plano-treino.service';
import { NIVEIS_RECOMENDADOS, TipoTreinoOpcao } from '../../../../core/models/plano-treino.models';

@Component({
  selector: 'app-cadastro-plano-treino',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro-plano-treino.html',
  styleUrls: ['./cadastro-plano-treino.css']
})
export class CadastroPlanoTreinoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private planoTreinoService = inject(PlanoTreinoService);

  readonly LIMITE_TITULO = 100;
  readonly LIMITE_DESCRICAO = 250;

  niveis = NIVEIS_RECOMENDADOS;
  tipos: TipoTreinoOpcao[] = [];

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
    this.planoTreinoService.listarTipos().subscribe({
      next: (lista) => (this.tipos = lista),
      error: (err: any) => {
        console.error('Erro ao carregar tipos de treino:', err);
        this.errorMessage = 'Não foi possível carregar os tipos de treino.';
      }
    });
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

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const idFuncionario = Number(localStorage.getItem('usuario_id'));
    if (!idFuncionario) {
      this.errorMessage = 'Não foi possível identificar o funcionário. Faça login novamente.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      idTipoTreino: Number(this.form.value.tipoTreino),
      idFuncionario: idFuncionario,
      titulo: this.form.value.titulo.trim(),
      descricao: this.form.value.descricao.trim(),
      nivelRecomendado: this.form.value.nivelRecomendado
    };

    this.planoTreinoService.criar(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Plano de treino cadastrado com sucesso!';
        this.form.reset({ tipoTreino: '', titulo: '', descricao: '', nivelRecomendado: '' });
      },
      error: (err: any) => {
        console.error('Erro ao cadastrar plano de treino:', err);
        this.isSubmitting = false;
        this.errorMessage = 'Erro ao cadastrar plano de treino. Tente novamente.';
      }
    });
  }
}