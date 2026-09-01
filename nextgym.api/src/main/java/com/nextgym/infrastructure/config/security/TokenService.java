package com.nextgym.infrastructure.config.security;

import com.nextgym.domain.models.Profissional;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class TokenService {

    @Value("${api.jwt.secret:NextGymApiSecKey2026_x89FqL90A2ZpQ817bVbKmP9q0L1aZr4T}")
    private String secret;

    private static final long EXPIRATION_TIME = 86400000L; // 24 horas

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(Profissional profissional) {
        var builder = Jwts.builder()
                .subject(profissional.getEmail())
                .claim("id", profissional.getId() != null ? profissional.getId().toString() : "")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey());

        if (profissional.getRole() != null) {
            builder.claim("role", profissional.getRole().name());
        }

        return builder.compact();
    }

    // Sobrecarga para gerar apenas com e-mail se necessário
    public String generateToken(String email) {
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey())
                .compact();
    }

    public String validarToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            return claims.getSubject();
        } catch (JwtException | IllegalArgumentException e) {
            return null;
        }
    }
}