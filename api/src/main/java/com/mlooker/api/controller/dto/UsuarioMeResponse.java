package com.mlooker.api.controller.dto;

public record UsuarioMeResponse(
		String username,
		String nombre,
		String rol,
		Long inversorId,
		Long creadorId,
		boolean verificado) {
}
