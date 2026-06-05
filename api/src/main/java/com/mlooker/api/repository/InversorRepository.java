package com.mlooker.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.mlooker.api.entity.Inversor;

public interface InversorRepository extends JpaRepository<Inversor, Long> {

	@Query("SELECT SUM(a.rendimientoMensual) FROM Inversor i JOIN i.activos a WHERE i.id = :inversorId")
	Optional<Double> sumRendimientoMensualByInversorId(@Param("inversorId") Long inversorId);
}
