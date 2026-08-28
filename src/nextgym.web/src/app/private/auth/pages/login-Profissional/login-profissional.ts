import { Component, inject } from '@angular/core';
import { CommonModule      } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink        } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,
            ReactiveFormsModule,
            RouterLink], 
  templateUrl: './login-profissional.html',
  styleUrls: ['./login-profissional.css']
})
export class LoginProfissionalComponent {
  private fb = inject(FormBuilder);

  loginForm = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
    console.log('Formulário pronto para o back', this.loginForm.value)
    } 
    else {
    this.loginForm.markAllAsTouched();
      }
  }

  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }
}