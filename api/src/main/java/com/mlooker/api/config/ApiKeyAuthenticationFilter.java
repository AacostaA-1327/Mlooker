package com.mlooker.api.config;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class ApiKeyAuthenticationFilter extends OncePerRequestFilter {

	public static final String API_KEY_HEADER = "X-API-Key";

	private final String configuredApiKey;

	public ApiKeyAuthenticationFilter(String configuredApiKey) {
		this.configuredApiKey = configuredApiKey;
	}

	@Override
	protected void doFilterInternal(
			HttpServletRequest request,
			HttpServletResponse response,
			FilterChain filterChain) throws ServletException, IOException {

		Authentication currentAuth = SecurityContextHolder.getContext().getAuthentication();
		if (currentAuth != null
				&& currentAuth.isAuthenticated()
				&& !(currentAuth instanceof AnonymousAuthenticationToken)) {
			filterChain.doFilter(request, response);
			return;
		}

		String apiKey = request.getHeader(API_KEY_HEADER);

		if (apiKey != null && !apiKey.isBlank()) {
			if (!isValidApiKey(apiKey)) {
				response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "API Key inválida");
				return;
			}
			var authentication = new UsernamePasswordAuthenticationToken(
					"api-key-client",
					null,
					List.of(new SimpleGrantedAuthority("ROLE_API")));
			SecurityContextHolder.getContext().setAuthentication(authentication);
		}

		filterChain.doFilter(request, response);
	}

	private boolean isValidApiKey(String apiKey) {
		return configuredApiKey != null
				&& !configuredApiKey.isBlank()
				&& configuredApiKey.equals(apiKey);
	}

	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) {
		return HttpMethod.GET.matches(request.getMethod())
				|| HttpMethod.OPTIONS.matches(request.getMethod());
	}
}
