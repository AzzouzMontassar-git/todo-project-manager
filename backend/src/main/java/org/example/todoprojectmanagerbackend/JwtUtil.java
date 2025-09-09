package org.example.todoprojectmanagerbackend;

import io.jsonwebtoken.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    private static final String SECRET_KEY_STRING = "your-secret-key-that-is-at-least-32-characters-long";
    private static final SecretKey SECRET_KEY = new SecretKeySpec(
            SECRET_KEY_STRING.getBytes(StandardCharsets.UTF_8),
            SignatureAlgorithm.HS256.getJcaName()
    );

    private static final int TOKEN_VALIDITY = 1000 * 60 * 60 * 10; // 10 heures
    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

    public String extractUsername(String token) {
        return extractAllClaims(token).getBody().getSubject();
    }

    public boolean isTokenExpired(String token) {
        return extractAllClaims(token).getBody().getExpiration().before(new Date());
    }

    public Jws<Claims> extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY)
                    .build()
                    .parseClaimsJws(token);
        } catch (JwtException e) {
            logger.error("Erreur lors du parsing ou validation du token JWT", e);
            throw new RuntimeException("Token JWT invalide", e);
        }
    }

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("username", userDetails.getUsername());
        // Ajoutez d'autres claims si nécessaire (ex: rôle)
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + TOKEN_VALIDITY))
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }
}
