package com.mlooker.api.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.mlooker.api.repository.InversorRepository;

@Service
public class InversorService {

	private final InversorRepository inversorRepository;

	public InversorService(InversorRepository inversorRepository) {
		this.inversorRepository = inversorRepository;
	}

	public Optional<Double> totalRegaliasByInversorId(Long inversorId) {
		if (!inversorRepository.existsById(inversorId)) {
			return Optional.empty();
		}
		return Optional.of(
				inversorRepository.sumRendimientoMensualByInversorId(inversorId).orElse(0.0));
	}
}
