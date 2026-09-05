import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  usuarioNome: string = 'Usuário';
  usuarioEmail: string = '';
  usuarioInicial: string = 'U';

  ngOnInit(): void {
    const nomeSalvo = localStorage.getItem('usuario_nome') || 'Recepção';
    const emailSalvo = localStorage.getItem('usuario_email') || 'recepcao@nextgym.com';

    this.usuarioNome = nomeSalvo;
    this.usuarioEmail = emailSalvo;
    this.usuarioInicial = nomeSalvo.trim().charAt(0).toUpperCase();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}