package com.mlooker.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.mlooker.api.entity.Inversor;

public interface InversorRepository extends JpaRepository<Inversor, Long> {

	@Query("SELECT SUM(a.rendimientoMensual) FROM Inversor i JOIN i.activos a WHERE i.id = :inversorId")
	Optional<Double> sumRendimientoMensualByInversorId(@Param("inversorId") Long inversorId);

	@Modifying
	@Query(
			value = "INSERT IGNORE INTO inversor_activo (inversor_id, activo_id) VALUES (:inversorId, :activoId)",
			nativeQuery = true)
	int linkActivo(@Param("inversorId") Long inversorId, @Param("activoId") Long activoId);

	@Query(
			value = "SELECT COUNT(*) FROM inversor_activo WHERE inversor_id = :inversorId AND activo_id = :activoId",
			nativeQuery = true)
	int countLink(@Param("inversorId") Long inversorId, @Param("activoId") Long activoId);

	@Modifying
	@Query(
			value = "DELETE FROM inversor_activo WHERE inversor_id = :inversorId AND activo_id = :activoId",
			nativeQuery = true)
	int unlinkActivo(@Param("inversorId") Long inversorId, @Param("activoId") Long activoId);

	@Query(
			value = "SELECT COUNT(*) FROM inversor_activo WHERE activo_id = :activoId",
			nativeQuery = true)
	int countInversoresByActivoId(@Param("activoId") Long activoId);

	@Modifying
	@Query(value = "DELETE FROM inversor_activo WHERE activo_id = :activoId", nativeQuery = true)
	int unlinkAllByActivoId(@Param("activoId") Long activoId);
}
