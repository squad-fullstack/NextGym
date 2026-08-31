export interface LoginRequest {
  email: string;
  senha: string;
}

export interface CadastroProfissionalRequest {
  nome: string;
  email: string;
  senha: string;
  cref: string;
}

export interface UsuarioResumo {
  id: string;
  nome: string;
  email: string;
  role: 'ADMIN' | 'PROFISSIONAL' | 'ALUNO';
}

export interface AuthResponse {
  token: string;
  usuario: UsuarioResumo;
}