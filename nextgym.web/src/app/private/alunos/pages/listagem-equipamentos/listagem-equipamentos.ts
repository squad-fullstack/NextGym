import { Component, OnInit, HostListener, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
  Equipamento,
  EquipamentoService,
  EquipamentoPayload
} from '../../../../core/services/equipamento.service';

@Component({
  selector: 'app-listagem-equipamentos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './listagem-equipamentos.html',
  styleUrls: ['./listagem-equipamentos.css']
})
export class ListagemEquipamentosComponent implements OnInit {
  private equipamentoService = inject(EquipamentoService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  private readonly categoriasPadrao = ['SUPERIORES', 'INFERIORES', 'CARDIO', 'PESO_LIVRE'];

  equipamentos: Equipamento[] = [];
  equipamentosFiltrados: Equipamento[] = [];
  categorias: string[] = [];
  categoriasModal: string[] = [...this.categoriasPadrao];

  termoBusca: string = '';
  filtroCategoria: string = '';

  totalRegistros: number = 0;
  isLoading: boolean = false;
  errorMessage: string = '';

  modalAberto: boolean = false;
  salvando: boolean = false;
  erroModal: string = '';
  equipamentoEmEdicao: Equipamento | null = null;

  formEquipamento: FormGroup = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(2)]],
    categoria: ['', Validators.required],
    descricao: ['', Validators.required],
    ativo: [true]
  });

  get modoEdicao(): boolean {
    return this.equipamentoEmEdicao !== null;
  }

  ngOnInit(): void {
    this.carregarEquipamentos();
  }

  @HostListener('document:keydown.escape')
  aoPressionarEsc(): void {
    if (this.modalAberto && !this.salvando) {
      this.fecharModal();
    }
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
        this.categorias = [...new Set(lista.map((e) => e.categoria).filter(Boolean))].sort();
        this.categoriasModal = [...new Set([...this.categoriasPadrao, ...this.categorias])].sort();

        this.aplicarFiltros();
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

  abrirCadastro(): void {
    this.equipamentoEmEdicao = null;
    this.erroModal = '';

    this.formEquipamento.reset({
      nome: '',
      categoria: '',
      descricao: '',
      ativo: true
    });

    this.modalAberto = true;
    this.cdr.detectChanges();
  }

  editarEquipamento(equipamento: Equipamento): void {
    this.equipamentoEmEdicao = equipamento;
    this.erroModal = '';

    this.formEquipamento.reset({
      nome: equipamento.nome ?? '',
      categoria: equipamento.categoria ?? '',
      descricao: equipamento.descricao ?? '',
      ativo: Boolean(equipamento.ativo)
    });

    this.modalAberto = true;
    this.cdr.detectChanges();
  }

  fecharModal(): void {
    if (this.salvando) return;

    this.modalAberto = false;
    this.equipamentoEmEdicao = null;
    this.erroModal = '';
    this.formEquipamento.reset({ nome: '', categoria: '', descricao: '', ativo: true });
    this.cdr.detectChanges();
  }

  salvarEquipamento(): void {
    if (this.formEquipamento.invalid || this.salvando) {
      this.formEquipamento.markAllAsTouched();
      return;
    }

    this.salvando = true;
    this.erroModal = '';

    const valores = this.formEquipamento.getRawValue();
    const payload: EquipamentoPayload = {
      nome: String(valores.nome).trim(),
      categoria: String(valores.categoria).trim(),
      descricao: String(valores.descricao).trim(),
      ativo: Boolean(valores.ativo)
    };

    const requisicao$ = this.equipamentoEmEdicao?.id
      ? this.equipamentoService.atualizar(this.equipamentoEmEdicao.id, payload)
      : this.equipamentoService.cadastrar(payload);

    requisicao$.subscribe({
      next: () => {
        this.salvando = false;
        this.fecharModal();
        this.carregarEquipamentos();
      },
      error: (err) => {
        this.salvando = false;
        this.erroModal =
          err?.error?.mensagem ||
          err?.error?.erro ||
          (this.modoEdicao
            ? 'Não foi possível atualizar o equipamento. Verifique os dados e tente novamente.'
            : 'Não foi possível cadastrar o equipamento. Verifique os dados e tente novamente.');
        console.error('Erro ao salvar equipamento:', err);
        this.cdr.detectChanges();
      }
    });
  }
}