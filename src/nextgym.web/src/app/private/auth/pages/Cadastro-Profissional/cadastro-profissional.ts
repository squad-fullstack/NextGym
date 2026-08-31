import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './cadastro-profissional.html',
  styleUrls: ['./cadastro-profissional.css']
})
export class CadastroProfissionalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  cadastroForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor() {
    this.cadastroForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      cref: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get nomeControl() { return this.cadastroForm.get('nome'); }
  get crefControl() { return this.cadastroForm.get('cref'); }
  get emailControl() { return this.cadastroForm.get('email'); }
  get senhaControl() { return this.cadastroForm.get('senha'); }

  onSubmit(): void {
    if (this.cadastroForm.invalid) {
      this.cadastroForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const payload = {
      nome: this.cadastroForm.value.nome,
      cref: this.cadastroForm.value.cref,
      email: this.cadastroForm.value.email,
      senha: this.cadastroForm.value.senha
    };

    this.authService.cadastrarProfissional(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Erro ao realizar cadastro. Verifique os dados informados.';
      }
    });
  }
}