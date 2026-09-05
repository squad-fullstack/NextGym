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
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    telefone: ['', [Validators.required]],
    idade: [null, [Validators.required, Validators.min(10), Validators.max(120)]],
    peso: [null, [Validators.required, Validators.min(20)]],
    altura: [null, [Validators.required, Validators.min(0.5), Validators.max(2.5)]],
    genero: ['MASCULINO', [Validators.required]],
    nivelExperiencia: ['NUNCA_TREINOU', [Validators.required]],
    diasDisponiveisSemana: [3, [Validators.required, Validators.min(1), Validators.max(7)]],
    restricaoMedica: ['']
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const payload = {
      ...this.form.value,
      idade: Number(this.form.value.idade),
      peso: Number(this.form.value.peso),
      altura: Number(this.form.value.altura),
      diasDisponiveisSemana: Number(this.form.value.diasDisponiveisSemana),
      restricaoMedica: this.form.value.restricaoMedica || 'Nenhuma restrição médica declarada.'
    };

    this.alunoService.cadastrar(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/alunos/listagem-alunos']);
      },
      error: (err) => {
        console.error('Erro ao cadastrar aluno:', err);
        this.errorMessage = 'Ocorreu um erro ao salvar o aluno. Verifique os dados e tente novamente.';
        this.isSubmitting = false;
      }
    });
  }
}