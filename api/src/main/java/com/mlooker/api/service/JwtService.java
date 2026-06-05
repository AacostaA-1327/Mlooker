package com.mlooker.api.service;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.mlooker.api.entity.Usuario;
import com.mlooker.api.security.UserPrincipal;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

	private final SecretKey secretKey;
	private final long expirationMs;

	public JwtService(
			@Value("${mlooker.jwt.secret:dev-jwt-secret-mlooker-local-32chars!!}") String secret,
			@Value("${mlooker.jwt.expiration-ms:86400000}") long expirationMs) {
		this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
		this.expirationMs = expirationMs;
	}

	public String generateToken(Usuario usuario, boolean verificado) {
		return Jwts.builder()
				.subject(usuario.getUsername())
				.claim("rol", usuario.getRol())
				.claim("nombre", usuario.getNombre())
				.claim("inversorId", usuario.getInversorId())
				.claim("creadorId", usuario.getCreadorId())
				.claim("verificado", verificado)
				.issuedAt(new Date())
				.expiration(new Date(System.currentTimeMillis() + expirationMs))
				.signWith(secretKey)
				.compact();
	}

	public UserPrincipal parsePrincipal(String token) {
		Claims claims = Jwts.parser()
				.verifyWith(secretKey)
				.build()
				.parseSignedClaims(token)
				.getPayload();

		return new UserPrincipal(
				claims.getSubject(),
				claims.get("rol", String.class),
				claims.get("nombre", String.class),
				claims.get("inversorId", Long.class),
				claims.get("creadorId", Long.class),
				Boolean.TRUE.equals(claims.get("verificado", Boolean.class)));
	}
}
