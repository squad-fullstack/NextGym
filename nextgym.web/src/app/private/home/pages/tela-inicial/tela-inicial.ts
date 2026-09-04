import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AlunoService } from '../../../../core/services/aluno.service';
import { Aluno } from '../../../../core/models/aluno.models';

@Component({
  selector: 'app-tela-inicial',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tela-inicial.html',
  styleUrls: ['./tela-inicial.css']
})
export class TelaInicialComponent implements OnInit {
  private alunoService = inject(AlunoService);

  alunosAtivos: number = 0;
  matriculasNoMes: number = 0;
  isLoading: boolean = false;

  ngOnInit(): void {
    this.carregarMetricas();
  }

  carregarMetricas(): void {
    this.isLoading = true;

    this.alunoService.listarTodos().subscribe({
      next: (alunos: Aluno[]) => {
        this.calcularMetricas(alunos);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar métricas:', err);
        this.isLoading = false;
      }
    });
  }

  private calcularMetricas(alunos: Aluno[]): void {
    this.alunosAtivos = alunos.filter(a => a.ativo === true).length;

    const agora = new Date();
    const anoAtual = agora.getFullYear();
    const mesAtual = agora.getMonth();

    const comData = alunos.filter(a => !!a.dataCriacao);

    if (comData.length > 0) {
      this.matriculasNoMes = comData.filter(a => {
        const data = new Date(a.dataCriacao!);
        return data.getFullYear() === anoAtual && data.getMonth() === mesAtual;
      }).length;
    } else {
      this.matriculasNoMes = alunos.length;
    }
  }
}