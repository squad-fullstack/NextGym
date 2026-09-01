package com.nextgym.infrastructure.config.security;

import com.nextgym.infrastructure.adapters.out.persistence.entities.ProfissionalEntity;
import com.nextgym.infrastructure.adapters.out.persistence.repositories.ProfissionalRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final ProfissionalRepository repository;

    public CustomUserDetailsService(ProfissionalRepository repository) {
        this.repository = repository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        ProfissionalEntity profissional = repository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com o e-mail: " + email));

        return new User(
                profissional.getEmail(),
                profissional.getSenha(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + profissional.getRole().name()))
        );
    }
}