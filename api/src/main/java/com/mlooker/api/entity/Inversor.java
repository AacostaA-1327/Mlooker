package com.mlooker.api.entity;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "inversores")
@Data
@NoArgsConstructor
public class Inversor {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String nombre;

	@Column(nullable = false)
	private Double saldo;

	@ManyToMany
	@JoinTable(
			name = "inversor_activo",
			joinColumns = @JoinColumn(name = "inversor_id"),
			inverseJoinColumns = @JoinColumn(name = "activo_id"))
	@JsonIgnore
	private Set<Activo> activos = new HashSet<>();
}
