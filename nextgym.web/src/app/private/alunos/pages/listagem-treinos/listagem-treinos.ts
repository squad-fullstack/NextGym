
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Treino {
  id: number;
  nome: string;
  descricao: string;
  nivel: string;
}

@Component({
  selector: 'app-listagem-treinos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './listagem-treinos.html',
  styleUrls: ['./listagem-treinos.css']
})
export class ListagemTreinosComponent {

  termoBusca = '';
  filtroNivel = '';

  isLoading = false;
  errorMessage = '';

  treinos: Treino[] = [
    {
      id: 1,
      nome: 'Treino A',
      descricao: 'Peito, ombro e tríceps',
      nivel: 'Iniciante'
    },
    {
      id: 2,
      nome: 'Treino B',
      descricao: 'Costas e bíceps',
      nivel: 'Intermediário'
    },
    {
      id: 3,
      nome: 'Treino C',
      descricao: 'Pernas e glúteos',
      nivel: 'Avançado'
    },
    {
      id: 4,
      nome: 'Treino D',
      descricao: 'Condicionamento físico completo',
      nivel: 'Atleta'
    }
  ];

  get treinosFiltrados(): Treino[] {
    const termo = this.termoBusca.trim().toLowerCase();

    return this.treinos.filter(treino => {
      const correspondeTexto =
        !termo ||
        treino.nome.toLowerCase().includes(termo) ||
        treino.descricao.toLowerCase().includes(termo);

      const correspondeNivel =
        !this.filtroNivel ||
        treino.nivel.toLowerCase() === this.filtroNivel.toLowerCase();

      return correspondeTexto && correspondeNivel;
    });
  }

  classeNivel(nivel: string | undefined): string {
    switch (nivel?.trim().toLowerCase()) {
      case 'iniciante':
        return 'nivel-iniciante';

      case 'intermediário':
      case 'intermediario':
        return 'nivel-intermediario';

      case 'avançado':
      case 'avancado':
        return 'nivel-avancado';

      case 'atleta':
        return 'nivel-atleta';

      default:
        return '';
    }
  }

  visualizarTreino(treino: Treino): void {
    alert(
      `Treino: ${treino.nome}\n` +
      `Grupo muscular: ${treino.descricao}\n` +
      `Nível: ${treino.nivel}`
    );
  }

  editarTreino(treino: Treino): void {
    const novoNome = prompt(
      'Digite o nome do treino:',
      treino.nome
    );

    if (novoNome === null || !novoNome.trim()) {
      return;
    }

    const novaDescricao = prompt(
      'Digite os grupos musculares:',
      treino.descricao
    );

    if (novaDescricao === null || !novaDescricao.trim()) {
      return;
    }

    const niveis = [
      'Iniciante',
      'Intermediário',
      'Avançado',
      'Atleta'
    ];

    const novoNivel = prompt(
      'Digite o nível: Iniciante, Intermediário, Avançado ou Atleta',
      treino.nivel
    );

    if (
      novoNivel === null ||
      !niveis.some(
        nivel => nivel.toLowerCase() === novoNivel.trim().toLowerCase()
      )
    ) {
      if (novoNivel !== null) {
        alert('Nível inválido. Nenhuma alteração foi salva.');
      }
      return;
    }

    treino.nome = novoNome.trim();
    treino.descricao = novaDescricao.trim();
    treino.nivel =
      niveis.find(
        nivel => nivel.toLowerCase() === novoNivel.trim().toLowerCase()
      )!;

    alert('Treino atualizado com sucesso!');
  }

  excluirTreino(treino: Treino): void {
    const confirmar = confirm(
      `Tem certeza que deseja excluir "${treino.nome}"?`
    );

    if (!confirmar) {
      return;
    }

    this.treinos = this.treinos.filter(
      item => item.id !== treino.id
    );
  }
}