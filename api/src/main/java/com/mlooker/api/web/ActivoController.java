package com.mlooker.api.web;

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

import com.mlooker.api.entity.Activo;
import com.mlooker.api.service.ActivoService;

@RestController
@RequestMapping("/api/activos")
public class ActivoController {

	private final ActivoService activoService;

	public ActivoController(ActivoService activoService) {
		this.activoService = activoService;
	}

	@GetMapping
	public List<Activo> findAll() {
		return activoService.findAll();
	}

	@GetMapping("/{id}")
	public ResponseEntity<Activo> findById(@PathVariable Long id) {
		return activoService.findById(id)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@PostMapping
	public ResponseEntity<Activo> create(@RequestBody Activo activo) {
		Activo saved = activoService.save(activo);
		return ResponseEntity.status(HttpStatus.CREATED).body(saved);
	}

	@PutMapping("/{id}")
	public ResponseEntity<Activo> update(@PathVariable Long id, @RequestBody Activo activo) {
		return activoService.findById(id)
				.map(existing -> {
					existing.setTitulo(activo.getTitulo());
					existing.setTipo(activo.getTipo());
					existing.setRendimientoMensual(activo.getRendimientoMensual());
					return ResponseEntity.ok(activoService.save(existing));
				})
				.orElse(ResponseEntity.notFound().build());
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		if (activoService.deleteById(id)) {
			return ResponseEntity.noContent().build();
		}
		return ResponseEntity.notFound().build();
	}
}
