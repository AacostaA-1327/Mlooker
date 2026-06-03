package com.mlooker.api.controller.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record PublicarActivoRequest(
		@NotBlank(message = "El nombre de la obra es obligatorio")
		@Size(max = 200, message = "El título no puede superar 200 caracteres")
		String titulo,

		@NotBlank(message = "El tipo es obligatorio")
		@Pattern(regexp = "MUSICA|LIBRO", message = "El tipo debe ser MUSICA o LIBRO")
		String tipo,

		@NotNull(message = "El precio total es obligatorio")
		@Positive(message = "El precio total debe ser mayor que cero")
		Double precioTotal,

		@NotNull(message = "Las fracciones son obligatorias")
		@Min(value = 1, message = "Debe haber al menos 1 fracción")
		Integer cantidadFracciones) {
}
