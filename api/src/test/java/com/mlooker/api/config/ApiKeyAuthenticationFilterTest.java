package com.mlooker.api.config;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;

class ApiKeyAuthenticationFilterTest {

	@AfterEach
	void clearContext() {
		SecurityContextHolder.clearContext();
	}

	@Test
	void validApiKey_authenticatesRequest() throws Exception {
		var filter = new ApiKeyAuthenticationFilter("test-api-key");
		var request = new MockHttpServletRequest("POST", "/api/v1/activos");
		request.addHeader(ApiKeyAuthenticationFilter.API_KEY_HEADER, "test-api-key");
		var response = new MockHttpServletResponse();

		filter.doFilter(request, response, new MockFilterChain());

		assertThat(SecurityContextHolder.getContext().getAuthentication()).isNotNull();
		assertThat(SecurityContextHolder.getContext().getAuthentication().isAuthenticated()).isTrue();
	}

	@Test
	void invalidApiKey_returns401() throws Exception {
		var filter = new ApiKeyAuthenticationFilter("test-api-key");
		var request = new MockHttpServletRequest("POST", "/api/v1/activos");
		request.addHeader(ApiKeyAuthenticationFilter.API_KEY_HEADER, "wrong-key");
		var response = new MockHttpServletResponse();

		filter.doFilter(request, response, new MockFilterChain());

		assertThat(response.getStatus()).isEqualTo(401);
	}
}
