package com.nextgym.repository;

import com.nextgym.domain.model.Profissional;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface ProfissionalRepository extends JpaRepository<Profissional, UUID> {
    Optional<Profissional> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByCref(String cref);
}