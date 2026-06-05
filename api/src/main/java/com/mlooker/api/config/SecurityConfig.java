package com.mlooker.api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.AuthorizationFilter;

import com.mlooker.api.service.JwtService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	ApiKeyAuthenticationFilter apiKeyAuthenticationFilter(
			@Value("${mlooker.security.api-key:}") String apiKey) {
		return new ApiKeyAuthenticationFilter(apiKey);
	}

	@Bean
	JwtAuthenticationFilter jwtAuthenticationFilter(JwtService jwtService) {
		return new JwtAuthenticationFilter(jwtService);
	}

	@Bean
	SecurityFilterChain securityFilterChain(
			HttpSecurity http,
			JwtAuthenticationFilter jwtAuthenticationFilter,
			ApiKeyAuthenticationFilter apiKeyAuthenticationFilter) throws Exception {
		http
				.csrf(csrf -> csrf.disable())
				.sessionManagement(session -> session
						.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(auth -> auth
						.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
						.requestMatchers("/", "/health", "/error").permitAll()
						.requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
						.requestMatchers(HttpMethod.POST, "/api/v1/auth/login").permitAll()
						.requestMatchers(HttpMethod.GET, "/api/v1/activos", "/api/v1/activos/**").permitAll()
						.requestMatchers(HttpMethod.GET, "/api/v1/creadores", "/api/v1/creadores/**").permitAll()
						.requestMatchers(HttpMethod.GET, "/api/v1/inversores/**").authenticated()
						.requestMatchers(HttpMethod.GET, "/api/v1/auth/me").authenticated()
						.requestMatchers(HttpMethod.POST, "/api/v1/inversores/*/invertir").hasRole("INVERSOR")
						.requestMatchers(HttpMethod.POST, "/api/v1/inversores/*/vender").hasRole("INVERSOR")
						.requestMatchers(HttpMethod.GET, "/api/v1/creadores/*/activos").hasRole("CREADOR")
						.requestMatchers(HttpMethod.POST, "/api/v1/creadores/*/activos").hasRole("CREADOR")
						.requestMatchers(HttpMethod.PUT, "/api/v1/creadores/*/activos/*").hasRole("CREADOR")
						.requestMatchers(HttpMethod.DELETE, "/api/v1/creadores/*/activos/*").hasRole("CREADOR")
						.requestMatchers(HttpMethod.GET, "/**").permitAll()
						.requestMatchers(HttpMethod.POST, "/**").authenticated()
						.requestMatchers(HttpMethod.PUT, "/**").authenticated()
						.requestMatchers(HttpMethod.DELETE, "/**").authenticated()
						.requestMatchers(HttpMethod.PATCH, "/**").authenticated()
						.anyRequest().authenticated())
				.httpBasic(Customizer.withDefaults())
				.addFilterBefore(jwtAuthenticationFilter, AuthorizationFilter.class)
				.addFilterBefore(apiKeyAuthenticationFilter, AuthorizationFilter.class);

		return http.build();
	}

	@Bean
	UserDetailsService userDetailsService(
			@Value("${spring.security.user.name}") String username,
			@Value("${spring.security.user.password}") String password,
			PasswordEncoder passwordEncoder) {
		return new InMemoryUserDetailsManager(
				User.builder()
						.username(username)
						.password(passwordEncoder.encode(password))
						.roles("USER")
						.build());
	}
}
