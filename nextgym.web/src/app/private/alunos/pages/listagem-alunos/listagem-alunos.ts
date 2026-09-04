import { Component, OnInit, inject } from '@angular/core';
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
      next: (data) => {
        this.alunos = data;
        this.alunosFiltrados = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro na requisição:', err);
        this.errorMessage = 'Não foi possível carregar os alunos. Verifique se a API está online e autenticada.';
        this.isLoading = false;
      }
    });
  }

  aplicarFiltros(): void {
  const termo = this.termoBusca.trim().toLowerCase();
  const filtroNivel = this.filtroPlano.trim().toUpperCase(); 

  const deveFiltrarTexto = termo.length >= 2;

  this.alunosFiltrados = this.alunos.filter(aluno => {
    const matchTexto = deveFiltrarTexto
      ? (aluno.nome?.toLowerCase().includes(termo) ||
         aluno.email?.toLowerCase().includes(termo) ||
         aluno.telefone?.includes(termo))
      : true;

    const matchNivel = filtroNivel
      ? aluno.nivelExperiencia?.toUpperCase() === filtroNivel
      : true;

    return matchTexto && matchNivel;
  });
}

  deletarAluno(id: number | undefined): void {
    if (!id) return;
    
    if (confirm('Tem certeza que deseja remover este aluno?')) {
      this.alunoService.excluir(id).subscribe({
        next: () => {
          this.alunos = this.alunos.filter(a => a.id !== id);
          this.aplicarFiltros();
        },
        error: (err) => {
          console.error('Erro ao excluir:', err);
          alert('Erro ao excluir aluno.');
        }
      });
    }
  }
}