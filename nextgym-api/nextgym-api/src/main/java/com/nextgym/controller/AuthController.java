package com.nextgym.controller;

import com.nextgym.domain.dto.AuthResponseDTO;
import com.nextgym.domain.dto.CadastroProfissionalDTO;
import com.nextgym.domain.dto.LoginDTO;
import com.nextgym.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/cadastro/profissional")
    public ResponseEntity<AuthResponseDTO> cadastrar(@RequestBody @Valid CadastroProfissionalDTO dto) {
        AuthResponseDTO response = authService.cadastrarProfissional(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody @Valid LoginDTO dto) {
        AuthResponseDTO response = authService.login(dto);
        return ResponseEntity.ok(response);
    }
}