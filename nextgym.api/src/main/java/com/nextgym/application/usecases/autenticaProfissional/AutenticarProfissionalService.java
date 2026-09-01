package com.nextgym.application.usecases.autenticaProfissional;

import com.nextgym.application.dtos.AuthResponseDTO;
import com.nextgym.application.dtos.LoginDTO;
import com.nextgym.infrastructure.config.security.TokenService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class AutenticarProfissionalService {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    public AutenticarProfissionalService(AuthenticationManager authenticationManager, TokenService tokenService) {
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
    }

    public AuthResponseDTO executar(LoginDTO dto) {
        var authToken = new UsernamePasswordAuthenticationToken(dto.email(), dto.senha());
        authenticationManager.authenticate(authToken);

        String token = tokenService.generateToken(dto.email());
        return new AuthResponseDTO(token);
    }
}