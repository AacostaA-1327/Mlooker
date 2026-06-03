package com.mlooker.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mlooker.api.controller.dto.TotalRegaliasResponse;
import com.mlooker.api.service.InversorService;

@RestController
@RequestMapping("/api/v1/inversores")
public class InversorController {

	private final InversorService inversorService;

	public InversorController(InversorService inversorService) {
		this.inversorService = inversorService;
	}

	@GetMapping("/{id}/regalias-total")
	public ResponseEntity<TotalRegaliasResponse> totalRegalias(@PathVariable Long id) {
		return inversorService.totalRegaliasByInversorId(id)
				.map(total -> ResponseEntity.ok(new TotalRegaliasResponse(id, total)))
				.orElse(ResponseEntity.notFound().build());
	}
}
