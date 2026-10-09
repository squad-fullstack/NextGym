export const NIVEIS_RECOMENDADOS = [
  { valor: 'NUNCA_TREINOU', texto: 'Nunca treinou' },
  { valor: 'INICIANTE', texto: 'Iniciante' },
  { valor: 'INTERMEDIARIO', texto: 'Intermediário' },
  { valor: 'AVANCADO', texto: 'Avançado' },
  { valor: 'ATLETA', texto: 'Atleta' }
];

export interface TipoTreinoOpcao {
  id: number;
  id_tipo_treino?: number;
  nome: string;
  descricao: string;
}

export interface PlanoTreinoPayload {
  idTipoTreino: number;
  idFuncionario: number;
  titulo: string;
  descricao: string;
  nivelRecomendado: string;
}