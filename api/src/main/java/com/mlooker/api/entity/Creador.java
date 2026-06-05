package com.mlooker.api.entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "creadores")
@Data
@NoArgsConstructor
public class Creador {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank(message = "El nombre es obligatorio")
	@Column(nullable = false)
	private String nombre;

	@NotBlank(message = "El email es obligatorio")
	@Email(message = "El email debe tener un formato válido")
	@Column(nullable = false, unique = true)
	private String email;

	@OneToMany(mappedBy = "creador")
	@JsonManagedReference
	private List<Activo> activos = new ArrayList<>();
}
