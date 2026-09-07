import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AlunoService } from '../../../../core/services/aluno.service';
import { AlunoValidators } from '../../../../shared/validators/aluno.validators';

@Component({
  selector: 'app-matricula-aluno',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './matricula-aluno.html',
  styleUrls: ['./matricula-aluno.css']
})
export class MatriculaAlunoComponent {
  private fb = inject(FormBuilder);
  private alunoService = inject(AlunoService);
  private router = inject(Router);

  isSubmitting = false;
  errorMessage = '';

  form: FormGroup = this.fb.group({
    nome: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        AlunoValidators.nomeCompleto()
      ]
    ],
    email: ['', [Validators.required, Validators.email]],
    telefone: [
      '',
      [
        Validators.required,
        AlunoValidators.telefoneValido()
      ]
    ],
    idade: [null, [Validators.required, Validators.min(1), Validators.max(120)]],
    peso: [
      null,
      [
        Validators.required,
        AlunoValidators.formatoPeso()
      ]
    ],
    altura: [
      null,
      [
        Validators.required,
        AlunoValidators.formatoAltura()
      ]
    ],
    genero: ['MASCULINO', [Validators.required]],
    nivelExperiencia: ['NUNCA_TREINOU', [Validators.required]],
    diasDisponiveisSemana: [3, [Validators.required, Validators.min(1), Validators.max(7)]],
    restricaoMedica: ['']
  });

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'Este campo é obrigatório.';
    if (control.errors['email']) return 'Informe um e-mail válido.';
    if (control.errors['minlength']) {
      return `Mínimo de ${control.errors['minlength'].requiredLength} caracteres.`;
    }
    if (control.errors['min']) return `O valor mínimo permitido é ${control.errors['min'].min}.`;
    if (control.errors['max']) return `O valor máximo permitido é ${control.errors['max'].max}.`;
    
    // Tratamentos do AlunoValidators.nomeCompleto()
    if (control.errors['apenasLetras']) {
      return 'O nome não pode conter números ou caracteres especiais.';
    }
    if (control.errors['nomeIncompleto']) {
      return 'Informe o nome completo (nome e sobrenome).';
    }

    if (control.errors['telefoneInvalido']) return 'Telefone inválido (ex: 11 99999-9999).';
    if (control.errors['formatoPesoInvalido']) return 'Informe um peso válido (ex: 75 ou 75.5).';
    if (control.errors['formatoAlturaInvalido']) return 'Informe a altura em metros (ex: 1.75).';

    return 'Valor inválido.';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const raw = this.form.value;

    const payload = {
      ...raw,
      nome: raw.nome.trim(),
      email: raw.email.trim().toLowerCase(),
      telefone: raw.telefone.trim(),
      idade: Number(raw.idade),
      peso: typeof raw.peso === 'string' ? parseFloat(raw.peso.replace(',', '.')) : Number(raw.peso),
      altura: typeof raw.altura === 'string' ? parseFloat(raw.altura.replace(',', '.')) : Number(raw.altura),
      diasDisponiveisSemana: Number(raw.diasDisponiveisSemana),
      restricaoMedica: raw.restricaoMedica?.trim() || 'Nenhuma restrição médica declarada.'
    };

    this.alunoService.cadastrar(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/alunos/listagem-alunos']);
      },
      error: (err: any) => {
        console.error('Erro ao cadastrar aluno:', err);
        this.isSubmitting = false;

        if (err.status === 409) {
          this.errorMessage = 'E-mail ou dados já cadastrados para outro aluno.';
        } else if (err.status === 400 && err?.error?.errors) {
          const validationErrors = Object.values(err.error.errors).flat().join(' ');
          this.errorMessage = validationErrors || 'Dados inconsistentes.';
        } else {
          this.errorMessage = err?.error?.message || 'Ocorreu um erro ao salvar o aluno. Verifique os dados e tente novamente.';
        }
      }
    });
  }
}