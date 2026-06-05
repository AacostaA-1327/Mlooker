package com.mlooker.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mlooker.api.entity.Creador;

public interface CreadorRepository extends JpaRepository<Creador, Long> {

	Optional<Creador> findByEmail(String email);
}
