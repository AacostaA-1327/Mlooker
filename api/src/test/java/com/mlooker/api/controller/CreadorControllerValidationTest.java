package com.mlooker.api.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestPropertySource(properties = "spring.profiles.active=test")
class CreadorControllerValidationTest {

	@Autowired
	private MockMvc mockMvc;

	@Test
	void createSinNombre_devuelve400ConErroresPorCampo() throws Exception {
		mockMvc.perform(post("/api/v1/creadores")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{"email":"artista@mlooker.demo"}
								"""))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.errors[0].field").value("nombre"))
				.andExpect(jsonPath("$.errors[0].message").value("El nombre es obligatorio"));
	}

	@Test
	void createConDatosValidos_devuelve201() throws Exception {
		mockMvc.perform(post("/api/v1/creadores")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{"nombre":"Quevedo","email":"quevedo@mlooker.demo"}
								"""))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.nombre").value("Quevedo"));
	}
}
