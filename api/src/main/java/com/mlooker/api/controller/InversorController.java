package com.mlooker.api.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mlooker.api.controller.dto.InvertirRequest;
import com.mlooker.api.controller.dto.InvertirResponse;
import com.mlooker.api.controller.dto.TotalRegaliasResponse;
import com.mlooker.api.controller.dto.VenderRequest;
import com.mlooker.api.entity.Inversor;
import com.mlooker.api.service.AuthService;
import com.mlooker.api.service.InversorService;

@RestController
@RequestMapping("/api/v1/inversores")
@CrossOrigin(origins = { "http://localhost:5173", "http://127.0.0.1:5173" })
public class InversorController {

	private final InversorService inversorService;
	private final AuthService authService;

	public InversorController(InversorService inversorService, AuthService authService) {
		this.inversorService = inversorService;
		this.authService = authService;
	}

	@GetMapping
	public ResponseEntity<List<Inversor>> findAll() {
		return ResponseEntity.ok(inversorService.findAll());
	}

	@GetMapping("/{id}")
	public ResponseEntity<Inversor> findById(@PathVariable Long id) {
		authService.requireInversor(id);
		return inversorService.findById(id)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@GetMapping("/{id}/regalias-total")
	public ResponseEntity<TotalRegaliasResponse> totalRegalias(@PathVariable Long id) {
		authService.requireInversor(id);
		return inversorService.totalRegaliasByInversorId(id)
				.map(total -> ResponseEntity.ok(new TotalRegaliasResponse(id, total)))
				.orElse(ResponseEntity.notFound().build());
	}

	@PostMapping("/{id}/invertir")
	public ResponseEntity<InvertirResponse> invertir(
			@PathVariable Long id,
			@RequestBody InvertirRequest request) {
		authService.requireInversor(id);
		InvertirResponse response = inversorService.invertir(id, request.activoId(), request.importe());
		return ResponseEntity.ok(response);
	}

	@PostMapping("/{id}/vender")
	public ResponseEntity<InvertirResponse> vender(
			@PathVariable Long id,
			@RequestBody VenderRequest request) {
		authService.requireInversor(id);
		InvertirResponse response = inversorService.vender(id, request.activoId(), request.importe());
		return ResponseEntity.ok(response);
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
			return ResponseEntity.ok().build();
		}
		return ResponseEntity.notFound().build();
	}
}
