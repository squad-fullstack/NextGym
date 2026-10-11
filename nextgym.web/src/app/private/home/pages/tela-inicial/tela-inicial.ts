import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AlunoService } from '../../../../core/services/aluno.service';

@Component({
  selector: 'app-tela-inicial',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tela-inicial.html',
  styleUrls: ['./tela-inicial.css']
})
export class TelaInicialComponent implements OnInit {
  private alunoService = inject(AlunoService);
  private cdr = inject(ChangeDetectorRef);

  alunosAtivos = 0;
  matriculasNoMes = 0;
  isLoading = false;

  ngOnInit(): void {
    this.carregarResumo();
  }

  carregarResumo(): void {
    this.isLoading = true;

    this.alunoService.listarTodos().subscribe({
      next: (data: any) => {
        let lista: any[] = [];

        if (Array.isArray(data)) {
          lista = data;
        } else if (data && Array.isArray(data.alunos)) {
          lista = data.alunos;
        } else if (data && Array.isArray(data.content)) {
          lista = data.content;
        } else if (data && Array.isArray(data.data)) {
          lista = data.data;
        }

        this.calcularMetricas(lista);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  calcularMetricas(alunos: any[]): void {
    this.alunosAtivos = alunos.filter((a) => a.ativo === true).length;
    this.matriculasNoMes = alunos.length;
  }
}