import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-cadastro-cliente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro-cliente.component.html',
  styleUrls: ['./cadastro-cliente.component.css']
})
export class CadastroClienteComponent {
  private fb = inject(FormBuilder);

  cadastroForm: FormGroup = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    cpf: ['', [Validators.required]],
    telefone: ['', [Validators.required]],
    dataNascimento: ['', [Validators.required]],
    plano: ['Mensal', [Validators.required]],
    observacoes: ['']
  });

  onSubmit() {
    if (this.cadastroForm.valid) {
      console.log('Cliente cadastrado:', this.cadastroForm.value);
      alert('Cliente cadastrado com sucesso!');
      this.cadastroForm.reset({ plano: 'Mensal' });
    } else {
      alert('Por favor, preencha todos os campos corretamente.');
    }
  }
}