import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login-profissional.html',
  styleUrls: ['./login-profissional.css']
})
export class LoginProfissionalComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = false;
  mostrarSenha = false;
  errorMessage = '';

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required]]
  });

  alternarVisibilidadeSenha(): void {
    this.mostrarSenha = !this.mostrarSenha;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMessage = 'Preencha o e-mail e a senha corretamente.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/home']);
      },
      error: (err: any) => {
        console.error('Erro na autenticação:', err);
        this.isLoading = false;

        if (err.status === 401 || err.status === 403) {
          this.errorMessage = 'E-mail ou senha incorretos.';
        } else if (err.status === 0) {
          this.errorMessage = 'Não foi possível conectar ao servidor. Verifique a conexão.';
        } else {
          this.errorMessage = err?.error?.message || 'Erro ao realizar login. Tente novamente.';
        }
      }
    });
  }
}