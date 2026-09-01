package com.nextgym.application.usecases.cadastrarProfissional;

import com.nextgym.application.dtos.AuthResponseDTO;
import com.nextgym.application.dtos.CadastroProfissionalDTO;
import com.nextgym.domain.models.Profissional;
import com.nextgym.domain.models.Role;
import com.nextgym.domain.ports.in.CadastrarProfissionalUseCase;
import com.nextgym.domain.ports.out.ProfissionalRepositoryPort;
import com.nextgym.infrastructure.config.security.TokenService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class CadastrarProfissionalService implements CadastrarProfissionalUseCase {

    private final ProfissionalRepositoryPort repositoryPort;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public CadastrarProfissionalService(ProfissionalRepositoryPort repositoryPort,
                                       PasswordEncoder passwordEncoder,
                                       TokenService tokenService) {
        this.repositoryPort = repositoryPort;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    @Override
    public AuthResponseDTO executar(CadastroProfissionalDTO dto) {
        if (repositoryPort.existePorEmail(dto.email())) {
            throw new IllegalArgumentException("E-mail já cadastrado no sistema.");
        }

        if (repositoryPort.existePorCref(dto.cref())) {
            throw new IllegalArgumentException("CREF já cadastrado no sistema.");
        }

        String senhaCriptografada = passwordEncoder.encode(dto.senha());

        Profissional novoProfissional = new Profissional(
            null,
            dto.nome(),
            dto.cref(),
            dto.email(),
            senhaCriptografada,
            Role.PROFISSIONAL 
        );

        Profissional profissionalSalvo = repositoryPort.salvar(novoProfissional);
        String token = tokenService.generateToken(profissionalSalvo);

        return new AuthResponseDTO(token);
    }
}