package com.mlooker.api.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.mlooker.api.controller.dto.PublicarActivoRequest;
import com.mlooker.api.entity.Activo;
import com.mlooker.api.entity.Creador;
import com.mlooker.api.repository.ActivoRepository;
import com.mlooker.api.repository.CreadorRepository;

@Service
public class ActivoService {

	private final ActivoRepository activoRepository;
	private final CreadorRepository creadorRepository;

	public ActivoService(ActivoRepository activoRepository, CreadorRepository creadorRepository) {
		this.activoRepository = activoRepository;
		this.creadorRepository = creadorRepository;
	}

	public List<Activo> findAll() {
		return activoRepository.findAll();
	}

	public Optional<Activo> findById(Long id) {
		return activoRepository.findById(id);
	}

	public Activo save(Activo activo) {
		resolveCreador(activo);
		return activoRepository.save(activo);
	}

	public Activo publicarObra(Long creadorId, PublicarActivoRequest request) {
		Creador creador = creadorRepository.findById(creadorId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Creador no encontrado"));

		Activo activo = new Activo();
		activo.setTitulo(request.titulo().trim());
		activo.setTipo(request.tipo());
		activo.setPrecioTotal(request.precioTotal());
		activo.setCantidadFracciones(request.cantidadFracciones());
		activo.setRendimientoMensual(request.precioTotal() / request.cantidadFracciones());
		activo.setPorcentajeDisponible(100.0);
		activo.setCreador(creador);

		return activoRepository.save(activo);
	}

	public boolean deleteById(Long id) {
		if (activoRepository.existsById(id)) {
			activoRepository.deleteById(id);
			return true;
		}
		return false;
	}

	public List<Activo> buscar(String tipo, Double rendimientoMinimo) {
		if (tipo != null && rendimientoMinimo != null) {
			return activoRepository.findByTipoAndRendimientoMensualGreaterThanEqual(tipo, rendimientoMinimo);
		}
		if (tipo != null) {
			return activoRepository.findByTipo(tipo);
		}
		if (rendimientoMinimo != null) {
			return activoRepository.findByRendimientoMensualGreaterThanEqual(rendimientoMinimo);
		}
		return activoRepository.findAll();
	}

	public void applyUpdate(Activo existing, Activo updated) {
		existing.setTitulo(updated.getTitulo());
		existing.setTipo(updated.getTipo());
		existing.setRendimientoMensual(updated.getRendimientoMensual());
		if (updated.getCreador() != null) {
			resolveCreador(updated);
			existing.setCreador(updated.getCreador());
		}
	}

	private void resolveCreador(Activo activo) {
		if (activo.getCreador() == null || activo.getCreador().getId() == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El activo debe incluir un creador válido");
		}
		Creador creador = creadorRepository.findById(activo.getCreador().getId())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Creador no encontrado"));
		activo.setCreador(creador);
	}
}
