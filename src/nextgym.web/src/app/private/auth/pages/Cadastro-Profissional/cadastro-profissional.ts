import { Component, inject } from '@angular/core';
import { CommonModule      } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RouterLink        } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule,
            ReactiveFormsModule,
            RouterLink], 
  templateUrl: './cadastro-profissional.html',
  styleUrls: ['./cadastro-profissional.css']
})
export class CadastroProfissionalComponent {
 cadastroForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.cadastroForm = this.fb.group({
      nome: ['', [Validators.required]],
      ra: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get nomeControl() { return this.cadastroForm.get('nome'); }
  get raControl() { return this.cadastroForm.get('ra'); }
  get emailControl() { return this.cadastroForm.get('email'); }
  get passwordControl() { return this.cadastroForm.get('password'); }

  onSubmit(): void {
    if (this.cadastroForm.valid) {
      console.log('Dados cadastrados:', this.cadastroForm.value);
      // Chame seu serviço/API aqui
    } else {
      this.cadastroForm.markAllAsTouched();
    }
  }
}