package com.mlooker.api.controller.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record CrearCreadorRequest(
		@NotBlank(message = "El nombre es obligatorio")
		String nombre,

		@NotBlank(message = "El email es obligatorio")
		@Email(message = "El email debe tener un formato válido")
		String email) {
}
