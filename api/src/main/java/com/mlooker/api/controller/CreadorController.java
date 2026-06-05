package com.mlooker.api.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mlooker.api.controller.dto.CrearCreadorRequest;
import com.mlooker.api.entity.Creador;
import com.mlooker.api.service.CreadorService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/creadores")
public class CreadorController {

	private final CreadorService creadorService;

	public CreadorController(CreadorService creadorService) {
		this.creadorService = creadorService;
	}

	@GetMapping
	public ResponseEntity<List<Creador>> findAll() {
		return ResponseEntity.ok(creadorService.findAll());
	}

	@GetMapping("/{id}")
	public ResponseEntity<Creador> findById(@PathVariable Long id) {
		return creadorService.findById(id)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@PostMapping
	public ResponseEntity<Creador> create(@Valid @RequestBody CrearCreadorRequest request) {
		Creador creador = new Creador();
		creador.setNombre(request.nombre());
		creador.setEmail(request.email());
		Creador saved = creadorService.save(creador);
		return ResponseEntity.status(HttpStatus.CREATED).body(saved);
	}

	@PutMapping("/{id}")
	public ResponseEntity<Creador> update(@PathVariable Long id, @Valid @RequestBody CrearCreadorRequest request) {
		return creadorService.findById(id)
				.map(existing -> {
					existing.setNombre(request.nombre());
					existing.setEmail(request.email());
					return ResponseEntity.ok(creadorService.save(existing));
				})
				.orElse(ResponseEntity.notFound().build());
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		if (creadorService.deleteById(id)) {
			return ResponseEntity.ok().build();
		}
		return ResponseEntity.notFound().build();
	}
}
