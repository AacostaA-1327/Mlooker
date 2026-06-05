package com.mlooker.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mlooker.api.entity.Activo;

public interface ActivoRepository extends JpaRepository<Activo, Long> {

	List<Activo> findByTipoAndRendimientoMensualGreaterThanEqual(String tipo, Double rendimientoMinimo);

	List<Activo> findByTipo(String tipo);

	List<Activo> findByRendimientoMensualGreaterThanEqual(Double rendimientoMinimo);

	List<Activo> findByCreadorIdOrderByIdDesc(Long creadorId);
}
