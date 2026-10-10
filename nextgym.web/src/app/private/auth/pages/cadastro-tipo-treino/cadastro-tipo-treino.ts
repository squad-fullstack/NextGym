import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TipoTreinoService } from '../../../../core/services/tipo-treino.service';

@Component({
  selector: 'app-cadastro-tipo-treino',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro-tipo-treino.html',
  styleUrls: ['./cadastro-tipo-treino.css']
})
export class CadastroTipoTreinoComponent {
  private fb = inject(FormBuilder);
  private tipoTreinoService = inject(TipoTreinoService);

  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  form: FormGroup = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    descricao: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]]
  });

  campoInvalido(campo: string): boolean {
    const control = this.form.get(campo);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  obterMensagemErro(campo: string): string {
    const control = this.form.get(campo);
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'Campo obrigatório.';
    if (control.errors['minlength']) {
      return `Mínimo de ${control.errors['minlength'].requiredLength} caracteres.`;
    }
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

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      nome: this.form.value.nome.trim(),
      descricao: this.form.value.descricao.trim()
    };

    this.tipoTreinoService.criar(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Tipo de treino cadastrado com sucesso!';
        this.form.reset();
      },
      error: (err: any) => {
        console.error('Erro ao cadastrar tipo de treino:', err);
        this.isSubmitting = false;
        this.errorMessage = 'Erro ao cadastrar tipo de treino. Tente novamente.';
      }
    });
  }
}