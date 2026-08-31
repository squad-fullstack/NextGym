package com.nextgym.domain.dto;

import java.util.UUID;

public record AuthResponseDTO(
    String token,
    UsuarioResumoDTO usuario
) {
    public record UsuarioResumoDTO(
        UUID id,
        String nome,
        String email,
        String role
    ) {}
}