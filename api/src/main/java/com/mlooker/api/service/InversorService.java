package com.mlooker.api.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.mlooker.api.controller.dto.InvertirResponse;
import com.mlooker.api.entity.Activo;
import com.mlooker.api.entity.Inversor;
import com.mlooker.api.repository.ActivoRepository;
import com.mlooker.api.repository.InversorRepository;

@Service
public class InversorService {

	private final InversorRepository inversorRepository;
	private final ActivoRepository activoRepository;

	public InversorService(InversorRepository inversorRepository, ActivoRepository activoRepository) {
		this.inversorRepository = inversorRepository;
		this.activoRepository = activoRepository;
	}

	public List<Inversor> findAll() {
		return inversorRepository.findAll();
	}

	public Optional<Inversor> findById(Long id) {
		return inversorRepository.findById(id);
	}

	public Inversor save(Inversor inversor) {
		return inversorRepository.save(inversor);
	}

	public boolean deleteById(Long id) {
		if (inversorRepository.existsById(id)) {
			inversorRepository.deleteById(id);
			return true;
		}
		return false;
	}

	public Optional<Double> totalRegaliasByInversorId(Long inversorId) {
		if (!inversorRepository.existsById(inversorId)) {
			return Optional.empty();
		}
		return Optional.of(
				inversorRepository.sumRendimientoMensualByInversorId(inversorId).orElse(0.0));
	}

	@Transactional
	public InvertirResponse invertir(Long inversorId, Long activoId, Double importe) {
		if (importe == null || importe <= 0) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El importe debe ser mayor que cero");
		}

		Inversor inversor = inversorRepository.findById(inversorId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Inversor no encontrado"));

		Activo activo = activoRepository.findById(activoId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Activo no encontrado"));

		int tokens = tokensFromImporte(activo, importe);
		double pctNecesario = tokens * porcentajePorToken(activo);

		if (inversor.getSaldo() < importe) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Saldo insuficiente");
		}

		if (activo.getPorcentajeDisponible() + 0.001 < pctNecesario) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No hay suficientes tokens disponibles");
		}

		inversor.setSaldo(inversor.getSaldo() - importe);
		inversorRepository.linkActivo(inversorId, activoId);
		activo.setPorcentajeDisponible(activo.getPorcentajeDisponible() - pctNecesario);

		inversorRepository.save(inversor);
		activoRepository.save(activo);

		return new InvertirResponse(
				inversor.getId(),
				activo.getId(),
				inversor.getSaldo(),
				activo.getPorcentajeDisponible());
	}

	@Transactional
	public InvertirResponse vender(Long inversorId, Long activoId, Double importe) {
		if (importe == null || importe <= 0) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El importe debe ser mayor que cero");
		}

		if (inversorRepository.countLink(inversorId, activoId) == 0) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No tienes tokens de este activo");
		}

		Inversor inversor = inversorRepository.findById(inversorId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Inversor no encontrado"));

		Activo activo = activoRepository.findById(activoId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Activo no encontrado"));

		int tokens = tokensFromImporte(activo, importe);
		double pctLiberado = tokens * porcentajePorToken(activo);

		inversor.setSaldo(inversor.getSaldo() + importe);
		activo.setPorcentajeDisponible(Math.min(100.0, activo.getPorcentajeDisponible() + pctLiberado));

		inversorRepository.save(inversor);
		activoRepository.save(activo);

		return new InvertirResponse(
				inversor.getId(),
				activo.getId(),
				inversor.getSaldo(),
				activo.getPorcentajeDisponible());
	}

	private int tokensFromImporte(Activo activo, Double importe) {
		double tokenPrice = activo.getPrecioTotal() / activo.getCantidadFracciones();
		return Math.max(1, (int) Math.round(importe / tokenPrice));
	}

	private double porcentajePorToken(Activo activo) {
		if (activo.getCantidadFracciones() == null || activo.getCantidadFracciones() <= 0) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El activo no tiene fracciones válidas");
		}
		return 100.0 / activo.getCantidadFracciones();
	}
}
