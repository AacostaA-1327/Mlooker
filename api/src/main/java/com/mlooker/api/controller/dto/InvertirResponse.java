package com.mlooker.api.controller.dto;

public record InvertirResponse(
		Long inversorId,
		Long activoId,
		Double nuevoSaldo,
		Double porcentajeDisponible) {
}
