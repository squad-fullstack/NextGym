package com.nextgym.security;

import com.nextgym.domain.model.Profissional;
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
        return Jwts.builder()
                .subject(profissional.getEmail())
                .claim("id", profissional.getId().toString())
                .claim("role", profissional.getRole().name())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey())
                .compact();
    }
}