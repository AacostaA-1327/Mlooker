package com.mlooker.api.controller.dto;

public record LoginResponse(
		String token,
		String username,
		String nombre,
		String rol,
		Long inversorId,
		Long creadorId,
		boolean verificado) {
}
