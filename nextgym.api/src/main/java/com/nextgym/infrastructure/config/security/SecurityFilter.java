package com.nextgym.infrastructure.config.security;

import com.nextgym.infrastructure.adapters.out.persistence.repositories.ProfissionalRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    private final TokenService tokenService;
    private final ProfissionalRepository repository;

    public SecurityFilter(TokenService tokenService, ProfissionalRepository repository) {
        this.tokenService = tokenService;
        this.repository = repository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();
        if (path.startsWith("/api/auth/")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = recuperarToken(request);

        if (token != null) {
            String email = tokenService.validarToken(token);
            if (email != null) {
                var profissionalOpt = repository.findByEmail(email);
                if (profissionalOpt.isPresent()) {
                    var profissional = profissionalOpt.get();
                    var authorities = Collections.singletonList(
                            new SimpleGrantedAuthority("ROLE_" + profissional.getRole().name())
                    );
                    var auth = new UsernamePasswordAuthenticationToken(profissional, null, authorities);
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            }
        }

        filterChain.doFilter(request, response);
    }

    private String recuperarToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        return authHeader.replace("Bearer ", "");
    }
}