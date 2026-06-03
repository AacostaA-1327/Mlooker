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
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.AuthorizationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Bean
	ApiKeyAuthenticationFilter apiKeyAuthenticationFilter(
			@Value("${mlooker.security.api-key:}") String apiKey) {
		return new ApiKeyAuthenticationFilter(apiKey);
	}

	@Bean
	SecurityFilterChain securityFilterChain(
			HttpSecurity http,
			ApiKeyAuthenticationFilter apiKeyAuthenticationFilter) throws Exception {
		http
				.csrf(csrf -> csrf.disable())
				.sessionManagement(session -> session
						.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(auth -> auth
						.requestMatchers(HttpMethod.GET, "/**").permitAll()
						.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
						.requestMatchers("/", "/health", "/error").permitAll()
						.requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
						.requestMatchers(HttpMethod.POST, "/**").authenticated()
						.requestMatchers(HttpMethod.PUT, "/**").authenticated()
						.requestMatchers(HttpMethod.DELETE, "/**").authenticated()
						.requestMatchers(HttpMethod.PATCH, "/**").authenticated()
						.anyRequest().authenticated())
				.httpBasic(Customizer.withDefaults())
				.addFilterBefore(apiKeyAuthenticationFilter, AuthorizationFilter.class);

		return http.build();
	}

	@Bean
	UserDetailsService userDetailsService(
			@Value("${spring.security.user.name}") String username,
			@Value("${spring.security.user.password}") String password) {
		PasswordEncoder encoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();
		return new InMemoryUserDetailsManager(
				User.builder()
						.username(username)
						.password(encoder.encode(password))
						.roles("USER")
						.build());
	}
}
