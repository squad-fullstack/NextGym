export enum TipoTreinoEnum {
  CALISTENIA = 1,
  HIPERTROFIA = 2,
  EMAGRECIMENTO = 3
}

export interface TipoTreinoOption {
  id: number;
  label: string;
}

export const TIPOS_TREINO_OPTIONS: TipoTreinoOption[] = [
  { id: TipoTreinoEnum.CALISTENIA, label: 'Calistenia' },
  { id: TipoTreinoEnum.HIPERTROFIA, label: 'Hipertrofia' },
  { id: TipoTreinoEnum.EMAGRECIMENTO, label: 'Emagrecimento' }
];