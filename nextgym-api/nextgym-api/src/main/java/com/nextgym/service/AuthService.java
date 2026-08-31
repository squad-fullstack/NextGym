package com.nextgym.service;

import com.nextgym.domain.dto.AuthResponseDTO;
import com.nextgym.domain.dto.CadastroProfissionalDTO;
import com.nextgym.domain.dto.LoginDTO;
import com.nextgym.domain.model.Profissional;
import com.nextgym.repository.ProfissionalRepository;
import com.nextgym.security.TokenService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final ProfissionalRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public AuthService(ProfissionalRepository repository, 
                       PasswordEncoder passwordEncoder, 
                       TokenService tokenService) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    @Transactional
    public AuthResponseDTO cadastrarProfissional(CadastroProfissionalDTO dto) {
        if (repository.existsByEmail(dto.email())) {
            throw new IllegalArgumentException("E-mail já cadastrado no sistema.");
        }
        if (repository.existsByCref(dto.cref())) {
            throw new IllegalArgumentException("CREF já cadastrado no sistema.");
        }

        String senhaCriptografada = passwordEncoder.encode(dto.senha());
        Profissional profissional = new Profissional(
                dto.nome(),
                dto.email(),
                senhaCriptografada,
                dto.cref()
        );

        Profissional salvo = repository.save(profissional);
        String token = tokenService.generateToken(salvo);

        return new AuthResponseDTO(
                token,
                new AuthResponseDTO.UsuarioResumoDTO(
                        salvo.getId(),
                        salvo.getNome(),
                        salvo.getEmail(),
                        salvo.getRole().name()
                )
        );
    }

    public AuthResponseDTO login(LoginDTO dto) {
        Profissional profissional = repository.findByEmail(dto.email())
                .orElseThrow(() -> new IllegalArgumentException("E-mail ou senha incorretos."));

        if (!passwordEncoder.matches(dto.senha(), profissional.getSenha())) {
            throw new IllegalArgumentException("E-mail ou senha incorretos.");
        }

        String token = tokenService.generateToken(profissional);

        return new AuthResponseDTO(
                token,
                new AuthResponseDTO.UsuarioResumoDTO(
                        profissional.getId(),
                        profissional.getNome(),
                        profissional.getEmail(),
                        profissional.getRole().name()
                )
        );
    }
}