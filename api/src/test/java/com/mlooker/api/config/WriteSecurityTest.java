package com.mlooker.api.config;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.mlooker.api.controller.ActivoController;
import com.mlooker.api.entity.Activo;
import com.mlooker.api.service.ActivoService;

@WebMvcTest(ActivoController.class)
@Import(SecurityConfig.class)
@ActiveProfiles("test")
class WriteSecurityTest {

	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private ActivoService activoService;

	@BeforeEach
	void setUp() {
		when(activoService.findAll()).thenReturn(java.util.List.of());
		when(activoService.save(any(Activo.class))).thenAnswer(invocation -> invocation.getArgument(0));
		when(activoService.deleteById(1L)).thenReturn(true);
	}

	@Test
	void getActivo_isPublic() throws Exception {
		mockMvc.perform(get("/api/v1/activos"))
				.andExpect(status().isOk());
	}

	@Test
	void postActivo_withoutCredentials_returns401() throws Exception {
		mockMvc.perform(post("/api/v1/activos")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"titulo\":\"x\",\"tipo\":\"MUSICA\",\"rendimientoMensual\":1.0}"))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void deleteActivo_withBasicAuth_isAllowed() throws Exception {
		mockMvc.perform(delete("/api/v1/activos/1").with(httpBasic("testuser", "testpass")))
				.andExpect(status().isOk());
	}
}
