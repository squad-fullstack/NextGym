import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

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

  ngOnInit(): void {
    const nomeSalvo = localStorage.getItem('usuario_nome') || 'Wendell';
    const emailSalvo = localStorage.getItem('usuario_email') || 'wendell@nextgym.com';

    this.usuarioNome = nomeSalvo;
    this.usuarioEmail = emailSalvo;
    this.usuarioInicial = nomeSalvo.charAt(0).toUpperCase();
  }
}