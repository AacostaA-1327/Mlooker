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
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import com.mlooker.api.controller.dto.CrearCreadorRequest;
import com.mlooker.api.controller.dto.PublicarActivoRequest;
import com.mlooker.api.entity.Activo;
import com.mlooker.api.entity.Creador;
import com.mlooker.api.service.ActivoService;
import com.mlooker.api.service.AuthService;
import com.mlooker.api.service.CreadorService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/creadores")
@CrossOrigin(origins = { "http://localhost:5173", "http://127.0.0.1:5173" })
public class CreadorController {

	private final CreadorService creadorService;
	private final ActivoService activoService;
	private final AuthService authService;

	public CreadorController(
			CreadorService creadorService,
			ActivoService activoService,
			AuthService authService) {
		this.creadorService = creadorService;
		this.activoService = activoService;
		this.authService = authService;
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

	@GetMapping("/{id}/activos")
	public ResponseEntity<List<Activo>> misActivos(@PathVariable Long id) {
		authService.requireCreadorVerificado(id);
		return ResponseEntity.ok(activoService.findByCreadorId(id));
	}

	@PostMapping("/{id}/activos")
	public ResponseEntity<Activo> publicarActivo(
			@PathVariable Long id,
			@Valid @RequestBody PublicarActivoRequest request) {
		authService.requireCreadorVerificado(id);
		Activo saved = activoService.publicarObra(id, request);
		return ResponseEntity.status(HttpStatus.CREATED).body(saved);
	}

	@PutMapping("/{id}/activos/{activoId}")
	public ResponseEntity<Activo> editarActivo(
			@PathVariable Long id,
			@PathVariable Long activoId,
			@Valid @RequestBody PublicarActivoRequest request) {
		authService.requireCreadorVerificado(id);
		Activo updated = activoService.editarObra(id, activoId, request);
		return ResponseEntity.ok(updated);
	}

	@DeleteMapping("/{id}/activos/{activoId}")
	public ResponseEntity<Void> eliminarActivo(
			@PathVariable Long id,
			@PathVariable Long activoId) {
		authService.requireCreadorVerificado(id);
		activoService.eliminarObra(id, activoId);
		return ResponseEntity.noContent().build();
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
