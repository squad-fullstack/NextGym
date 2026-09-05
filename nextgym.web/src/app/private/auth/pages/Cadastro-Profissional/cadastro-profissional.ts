import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-cadastro-profissional',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './cadastro-profissional.html',
  styleUrls: ['./cadastro-profissional.css']
})
export class CadastroProfissionalComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isSubmitting = false;
  mostrarSenha = false;
  errorMessage = '';

  form: FormGroup = this.fb.group({
    nome: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    registroAcademico: ['', [Validators.required]],
    perfil: ['PROFESSOR', [Validators.required]]
  });

  alternarVisibilidadeSenha(): void {
    this.mostrarSenha = !this.mostrarSenha;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.authService.cadastrarProfissional(this.form.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/auth/login']);
      },
      error: (err: any) => {
        console.error('Erro no cadastro:', err);
        this.isSubmitting = false;

        if (err.status === 409) {
          this.errorMessage = 'E-mail ou Registro Acadêmico já cadastrado.';
        } else {
          this.errorMessage = err?.error?.message || 'Erro ao cadastrar profissional. Verifique os dados.';
        }
      }
    });
  }
}