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

import com.mlooker.api.entity.Inversor;
import com.mlooker.api.service.InversorService;

@RestController
@RequestMapping("/api/inversores")
public class InversorController {

	private final InversorService inversorService;

	public InversorController(InversorService inversorService) {
		this.inversorService = inversorService;
	}

	@GetMapping
	public List<Inversor> findAll() {
		return inversorService.findAll();
	}

	@GetMapping("/{id}")
	public ResponseEntity<Inversor> findById(@PathVariable Long id) {
		return inversorService.findById(id)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@PostMapping
	public ResponseEntity<Inversor> create(@RequestBody Inversor inversor) {
		Inversor saved = inversorService.save(inversor);
		return ResponseEntity.status(HttpStatus.CREATED).body(saved);
	}

	@PutMapping("/{id}")
	public ResponseEntity<Inversor> update(@PathVariable Long id, @RequestBody Inversor inversor) {
		return inversorService.findById(id)
				.map(existing -> {
					existing.setNombre(inversor.getNombre());
					existing.setSaldo(inversor.getSaldo());
					return ResponseEntity.ok(inversorService.save(existing));
				})
				.orElse(ResponseEntity.notFound().build());
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		if (inversorService.deleteById(id)) {
			return ResponseEntity.noContent().build();
		}
		return ResponseEntity.notFound().build();
	}
}
