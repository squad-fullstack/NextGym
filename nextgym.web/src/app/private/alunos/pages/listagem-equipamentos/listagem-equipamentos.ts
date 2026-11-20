import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Equipamento, EquipamentoService } from '../../../../core/services/equipamento.service';


@Component({
  selector: 'app-listagem-equipamentos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './listagem-equipamentos.html',
  styleUrls: ['./listagem-equipamentos.css']
})
export class ListagemEquipamentosComponent implements OnInit {
  private equipamentoService = inject(EquipamentoService);
  private cdr = inject(ChangeDetectorRef);

  equipamentos: Equipamento[] = [];
  equipamentosFiltrados: Equipamento[] = [];
  categorias: string[] = [];

  termoBusca: string = '';
  filtroCategoria: string = '';

  totalRegistros: number = 0;
  isLoading: boolean = false;
  errorMessage: string = '';

  ngOnInit(): void {
    this.carregarEquipamentos();
  }

  carregarEquipamentos(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.equipamentoService.listar().subscribe({
      next: (resposta) => {
        const lista = resposta?.equipamentos ?? [];

        this.equipamentos = lista;
        this.equipamentosFiltrados = [...lista];
        this.totalRegistros = resposta?.totalRegistros ?? lista.length;
        this.categorias = [...new Set(lista.map((e) => e.categoria))].sort();

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Não foi possível carregar os equipamentos. Verifique se a API está online e autenticada.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  aplicarFiltros(): void {
    const termo = (this.termoBusca || '').trim().toLowerCase();
    const categoria = (this.filtroCategoria || '').trim();

    this.equipamentosFiltrados = this.equipamentos.filter((equipamento) => {
      const nome = String(equipamento.nome || '').toLowerCase();
      const descricao = String(equipamento.descricao || '').toLowerCase();

      const matchTexto = !termo || nome.includes(termo) || descricao.includes(termo);
      const matchCategoria = !categoria || equipamento.categoria === categoria;

      return matchTexto && matchCategoria;
    });

    this.cdr.detectChanges();
  }
}