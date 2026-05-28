package com.mlooker.api.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.mlooker.api.entity.Activo;
import com.mlooker.api.repository.ActivoRepository;

@Service
public class ActivoService {

	private final ActivoRepository activoRepository;

	public ActivoService(ActivoRepository activoRepository) {
		this.activoRepository = activoRepository;
	}

	public List<Activo> findAll() {
		return activoRepository.findAll();
	}

	public Optional<Activo> findById(Long id) {
		return activoRepository.findById(id);
	}

	public Activo save(Activo activo) {
		return activoRepository.save(activo);
	}

	public boolean deleteById(Long id) {
		if (activoRepository.existsById(id)) {
			activoRepository.deleteById(id);
			return true;
		}
		return false;
	}
}
