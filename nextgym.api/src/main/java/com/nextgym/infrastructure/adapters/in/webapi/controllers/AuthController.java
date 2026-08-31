package com.nextgym.infrastructure.adapters.in.webapi.controllers;

import com.nextgym.application.dtos.AuthResponseDTO;
import com.nextgym.application.dtos.CadastroProfissionalDTO;
import com.nextgym.application.dtos.LoginDTO;
import com.nextgym.application.usecases.autenticaProfissional.AutenticarProfissionalService;
import com.nextgym.domain.ports.in.CadastrarProfissionalUseCase;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600)
    @RestController
    @RequestMapping("/api/auth")
    public class AuthController {
   
    private final CadastrarProfissionalUseCase cadastrarProfissionalUseCase;
    private final AutenticarProfissionalService autenticarProfissionalService;

    public AuthController(CadastrarProfissionalUseCase cadastrarProfissionalUseCase,
                          AutenticarProfissionalService autenticarProfissionalService) {
        this.cadastrarProfissionalUseCase = cadastrarProfissionalUseCase;
        this.autenticarProfissionalService = autenticarProfissionalService;
    }

    @PostMapping("/cadastro/profissional")
    public ResponseEntity<AuthResponseDTO> cadastrar(@RequestBody @Valid CadastroProfissionalDTO dto) {
        AuthResponseDTO response = cadastrarProfissionalUseCase.executar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody @Valid LoginDTO dto) {
        AuthResponseDTO response = autenticarProfissionalService.executar(dto);
        return ResponseEntity.ok(response);
    }
}