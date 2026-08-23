import { Component, inject } from '@angular/core';
import { CommonModule      } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink        } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule,
            ReactiveFormsModule,
            RouterLink], 
  templateUrl: './Cadastro-Assistente.html',
  styleUrls: ['./Cadastro-Assistente.css']
})
export class CadastroComponent {
  private fb = inject(FormBuilder);

}