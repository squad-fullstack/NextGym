export interface Aluno {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
  idade?: number;
  peso?: number;
  altura?: number;
  genero?: string;
  nivelExperiencia?: string;
  diasDisponiveisSemana?: number;
  restricaoMedica?: string;
  ativo: boolean;
  dataCriacao?: string;
}

export interface CadastroAluno {
  nome: string;
  email: string;
  telefone: string;
  idade: number;
  peso: number;
  altura: number;
  genero: string;
  nivelExperiencia: string;
  diasDisponiveisSemana: number;
  restricaoMedica: string;
}