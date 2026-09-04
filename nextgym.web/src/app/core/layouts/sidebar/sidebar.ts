import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router,  RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent implements OnInit {
  usuarioNome: string = 'Usuário';
  usuarioEmail: string = '';
  usuarioInicial: string = 'U';
  private router = inject(Router);

  ngOnInit(): void {
    const nomeSalvo = localStorage.getItem('usuario_nome') || 'Wendell';
    const emailSalvo = localStorage.getItem('usuario_email') || 'wendell@nextgym.com';

    this.usuarioNome = nomeSalvo;
    this.usuarioEmail = emailSalvo;
    this.usuarioInicial = nomeSalvo.charAt(0).toUpperCase();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario_nome');
    localStorage.removeItem('usuario_email');

    this.router.navigate(['/auth/login']);
  }
}