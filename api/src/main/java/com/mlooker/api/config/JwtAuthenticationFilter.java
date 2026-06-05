package com.mlooker.api.config;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.mlooker.api.security.UserPrincipal;
import com.mlooker.api.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

	public static final String AUTHORIZATION_HEADER = "Authorization";
	private static final String BEARER_PREFIX = "Bearer ";

	private final JwtService jwtService;

	public JwtAuthenticationFilter(JwtService jwtService) {
		this.jwtService = jwtService;
	}

	@Override
	protected void doFilterInternal(
			HttpServletRequest request,
			HttpServletResponse response,
			FilterChain filterChain) throws ServletException, IOException {

		String header = request.getHeader(AUTHORIZATION_HEADER);
		if (header != null && header.startsWith(BEARER_PREFIX)) {
			String token = header.substring(BEARER_PREFIX.length()).trim();
			try {
				UserPrincipal principal = jwtService.parsePrincipal(token);
				var authentication = new UsernamePasswordAuthenticationToken(
						principal,
						null,
						principal.getAuthorities());
				SecurityContextHolder.getContext().setAuthentication(authentication);
			} catch (RuntimeException ex) {
				response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token inválido o expirado");
				return;
			}
		}

		filterChain.doFilter(request, response);
	}
}
