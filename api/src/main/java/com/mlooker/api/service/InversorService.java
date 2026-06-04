package com.mlooker.api.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.mlooker.api.entity.Inversor;
import com.mlooker.api.repository.InversorRepository;

@Service
public class InversorService {

	private final InversorRepository inversorRepository;

	public InversorService(InversorRepository inversorRepository) {
		this.inversorRepository = inversorRepository;
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
}
