package com.nextgym.domain.ports.in;

import com.nextgym.application.dtos.AuthResponseDTO;
import com.nextgym.application.dtos.CadastroProfissionalDTO;

public interface CadastrarProfissionalUseCase {
    AuthResponseDTO executar(CadastroProfissionalDTO dto);
}