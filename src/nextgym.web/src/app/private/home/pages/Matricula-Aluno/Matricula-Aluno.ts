import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-matricula-aluno',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './Matricula-Aluno.html',
  styleUrls: ['./Matricula-Aluno.css']
})
export class MatriculaAlunoComponent {
  private fb = inject(FormBuilder);

  cadastroForm: FormGroup = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    cpf: ['', [Validators.required]],
    plano: ['Mensal', [Validators.required]]
  });

  onSubmit() {
    if (this.cadastroForm.valid) {
      console.log('Cliente Cadastrado:', this.cadastroForm.value);
      alert('Cliente cadastrado com sucesso!');
      this.cadastroForm.reset({ plano: 'Mensal' });
    } else {
      alert('Por favor, preencha todos os campos corretamente.');
    }
  }
}   