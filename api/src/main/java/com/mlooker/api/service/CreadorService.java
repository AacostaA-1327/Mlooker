package com.mlooker.api.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.mlooker.api.entity.Creador;
import com.mlooker.api.repository.CreadorRepository;

@Service
public class CreadorService {

	private final CreadorRepository creadorRepository;

	public CreadorService(CreadorRepository creadorRepository) {
		this.creadorRepository = creadorRepository;
	}

	public List<Creador> findAll() {
		return creadorRepository.findAll();
	}

	public Optional<Creador> findById(Long id) {
		return creadorRepository.findById(id);
	}

	public Creador save(Creador creador) {
		return creadorRepository.save(creador);
	}

	public boolean deleteById(Long id) {
		if (creadorRepository.existsById(id)) {
			creadorRepository.deleteById(id);
			return true;
		}
		return false;
	}
}
