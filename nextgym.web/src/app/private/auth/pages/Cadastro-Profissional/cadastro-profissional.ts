import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
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

  cadastroForm: FormGroup = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    cref: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]]
  });

  errorMessage: string = '';
  isLoading: boolean = false;

  get nomeControl(): AbstractControl | null {
    return this.cadastroForm.get('nome');
  }

  get crefControl(): AbstractControl | null {
    return this.cadastroForm.get('cref');
  }

  get emailControl(): AbstractControl | null {
    return this.cadastroForm.get('email');
  }

  get senhaControl(): AbstractControl | null {
    return this.cadastroForm.get('senha');
  }

  onSubmit(): void {
    if (this.cadastroForm.invalid) {
      this.cadastroForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.cadastrarProfissional(this.cadastroForm.value).subscribe({
      next: (res: any) => {
        this.router.navigate(['/auth/login']);
      },
      error: (err: any) => {
        console.error('Erro no cadastro:', err);
      }
    });
  }
}