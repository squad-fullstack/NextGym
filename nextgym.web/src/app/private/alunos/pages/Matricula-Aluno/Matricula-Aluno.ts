import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AlunoService } from '../../../../core/services/aluno.service';

@Component({
  selector: 'app-matricula-aluno',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './Matricula-Aluno.html',
  styleUrls: ['./Matricula-Aluno.css']
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
        Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)
      ]
    ],
    email: ['', [Validators.required, Validators.email]],
    telefone: [
      '',
      [
        Validators.required,
        Validators.pattern(/^(\(?\d{2}\)?\s?)?(\d{4,5}\-?\d{4})$/)
      ]
    ],
    idade: [null, [Validators.required, Validators.min(1), Validators.max(120)]],
    peso: [
      null,
      [
        Validators.required,
        Validators.pattern(/^\d{1,3}([.,]\d{1,2})?$/)
      ]
    ],
    altura: [
      null,
      [
        Validators.required,
        Validators.pattern(/^(0|1|2)([.,]\d{1,2})?$/)
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
        } else {
          this.errorMessage = err?.error?.message || 'Ocorreu um erro ao salvar o aluno. Verifique os dados e tente novamente.';
        }
      }
    });
  }
}