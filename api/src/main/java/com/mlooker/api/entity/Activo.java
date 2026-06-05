package com.mlooker.api.entity;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "activos")
@Data
@NoArgsConstructor
public class Activo {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String titulo;

	@Column(nullable = false)
	private String tipo;

	@Column(nullable = false)
	private Double rendimientoMensual;

	@Column(nullable = false)
	private Double precioTotal;

	@Column(nullable = false)
	private Integer cantidadFracciones;

	@Column(nullable = false)
	private Double porcentajeDisponible = 100.0;

	@ManyToOne(optional = false)
	@JoinColumn(name = "creador_id", nullable = false)
	@JsonIgnoreProperties("activos")
	private Creador creador;

	@ManyToMany(mappedBy = "activos")
	@JsonIgnore
	private Set<Inversor> inversores = new HashSet<>();
}
