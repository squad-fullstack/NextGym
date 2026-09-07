import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ProfissionalValidators } from '../../../../shared/validators/profissional.validator';

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
    nome: [
      '',
      [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100),
        ProfissionalValidators.nomeCompleto()
      ]
    ],
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.maxLength(150)
      ]
    ],
    senha: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        ProfissionalValidators.senhaForte()
      ]
    ],
    registroAcademico: [
      '',
      [
        Validators.required,
        ProfissionalValidators.registroOuCref()
      ]
    ],
    perfil: ['PROFESSOR', [Validators.required]]
  });

  alternarVisibilidadeSenha(): void {
    this.mostrarSenha = !this.mostrarSenha;
  }

  campoInvalido(campo: string): boolean {
    const control = this.form.get(campo);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  obterMensagemErro(campo: string): string {
    const control = this.form.get(campo);
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'Campo obrigatório.';
    if (control.errors['email']) return 'Informe um e-mail válido.';
    if (control.errors['minlength']) {
      return `Mínimo de ${control.errors['minlength'].requiredLength} caracteres.`;
    }
    if (control.errors['apenasLetras']) {
      return 'O nome não pode conter números ou símbolos.';
    }
    if (control.errors['nomeIncompleto']) {
      return 'Informe o nome e sobrenome.';
    }
    // Erro da senha:
    if (control.errors['senhaFraca']) {
      return 'A senha deve ter no mínimo 6 caracteres, contendo pelo menos 1 número e 1 caractere especial (!@#$).';
    }
    if (control.errors['registroInvalido']) {
      return 'Informe um RA válido ou CREF (ex: 123456-G/SP).';
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

    const payload = {
      ...this.form.value,
      nome: this.form.value.nome.trim(),
      email: this.form.value.email.trim().toLowerCase(),
      registroAcademico: this.form.value.registroAcademico.trim().toUpperCase()
    };

    this.authService.cadastrarProfissional(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/auth/login'], { 
          queryParams: { cadastrado: 'true' } 
        });
      },
      error: (err: any) => {
        console.error('Erro no cadastro:', err);
        this.isSubmitting = false;

        if (err.status === 409) {
          this.errorMessage = 'E-mail ou Registro Acadêmico/CREF já cadastrado.';
        } else if (err.status === 400 && err?.error?.errors) {
          const validationErrors = Object.values(err.error.errors).flat().join(' ');
          this.errorMessage = validationErrors || 'Dados inconsistentes.';
        } else {
          this.errorMessage = err?.error?.message || 'Erro ao cadastrar profissional. Verifique os dados.';
        }
      }
    });
  }
}