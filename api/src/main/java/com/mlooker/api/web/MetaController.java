package com.mlooker.api.web;

import java.time.Instant;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MetaController {

	@GetMapping(path = "/", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Map<String, Object>> root() {
		return ResponseEntity.ok(Map.of(
				"service", "mlooker-api",
				"status", "up",
				"time", Instant.now().toString(),
				"docs", "/swagger-ui.html",
				"openapi", "/v3/api-docs"
		));
	}

	@GetMapping(path = "/health", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Map<String, Object>> health() {
		return ResponseEntity.ok(Map.of(
				"status", "UP",
				"time", Instant.now().toString()
		));
	}
}

