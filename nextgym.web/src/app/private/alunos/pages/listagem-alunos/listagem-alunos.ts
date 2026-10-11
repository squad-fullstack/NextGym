import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Aluno } from '../../../../core/models/aluno.models';
import { AlunoService } from '../../../../core/services/aluno.service';

@Component({
  selector: 'app-listagem-alunos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './listagem-alunos.html',
  styleUrls: ['./listagem-alunos.css']
})
export class ListagemAlunoComponent implements OnInit {
  private alunoService = inject(AlunoService);
  private cdr = inject(ChangeDetectorRef);

  alunos: Aluno[] = [];
  alunosFiltrados: Aluno[] = [];

  termoBusca: string = '';
  filtroPlano: string = '';

  isLoading: boolean = false;
  errorMessage: string = '';

  ngOnInit(): void {
    this.carregarAlunos();
  }

  carregarAlunos(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.alunoService.listarTodos().subscribe({
      next: (data: any) => {
        let lista: Aluno[] = [];

        if (Array.isArray(data)) {
          lista = data;
        } else if (data && Array.isArray(data.alunos)) {
          lista = data.alunos;
        } else if (data && Array.isArray(data.content)) {
          lista = data.content;
        } else if (data && Array.isArray(data.data)) {
          lista = data.data;
        }

        this.alunos = lista;
        this.alunosFiltrados = [...lista];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Não foi possível carregar os alunos. Verifique se a API está online e autenticada.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  aplicarFiltros(): void {
    const termo = (this.termoBusca || '').trim().toLowerCase();
    const filtroNivel = (this.filtroPlano || '').trim().toUpperCase();

    if (!termo && !filtroNivel) {
      this.alunosFiltrados = [...this.alunos];
      this.cdr.detectChanges();
      return;
    }

    this.alunosFiltrados = this.alunos.filter((aluno: any) => {
      const nomeVal = String(aluno.nome || '').toLowerCase();
      const emailVal = String(aluno.email || '').toLowerCase();
      const telVal = String(aluno.telefone || '');

      const matchTexto = !termo || nomeVal.includes(termo) || emailVal.includes(termo) || telVal.includes(termo);

      const nivelBruto = String(aluno.nivelExperiencia || aluno.nivel || '').trim().toUpperCase();
      const matchNivel = !filtroNivel || nivelBruto === filtroNivel;

      return matchTexto && matchNivel;
    });

    this.cdr.detectChanges();
  }

  deletarAluno(id: number | undefined): void {
    if (!id) return;

    if (confirm('Tem certeza que deseja remover este aluno?')) {
      this.alunoService.excluir(id).subscribe({
        next: () => {
          this.alunos = this.alunos.filter((a) => a.id !== id);
          this.aplicarFiltros();
        },
        error: () => {
          alert('Erro ao excluir aluno.');
        }
      });
    }
  }
}