package com.nextgym.infrastructure.adapters.in.webapi.controllers;

import com.nextgym.infrastructure.adapters.out.persistence.entities.ProfissionalEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/teste")
public class TesteController {

    @GetMapping("/protegido")
    public ResponseEntity<Map<String, String>> rotaProtegida(@AuthenticationPrincipal ProfissionalEntity profissional) {
        return ResponseEntity.ok(Map.of(
            "mensagem", "Acesso autorizado com sucesso!",
            "usuario", profissional.getNome(),
            "email", profissional.getEmail(),
            "role", profissional.getRole().name()
        ));
    }
}