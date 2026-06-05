package com.mlooker.api.security;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class UserPrincipal implements UserDetails {

	private final String username;
	private final String rol;
	private final String nombre;
	private final Long inversorId;
	private final Long creadorId;
	private final boolean verificado;

	public UserPrincipal(
			String username,
			String rol,
			String nombre,
			Long inversorId,
			Long creadorId,
			boolean verificado) {
		this.username = username;
		this.rol = rol;
		this.nombre = nombre;
		this.inversorId = inversorId;
		this.creadorId = creadorId;
		this.verificado = verificado;
	}

	public String getRol() {
		return rol;
	}

	public String getNombre() {
		return nombre;
	}

	public Long getInversorId() {
		return inversorId;
	}

	public Long getCreadorId() {
		return creadorId;
	}

	public boolean isVerificado() {
		return verificado;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return List.of(new SimpleGrantedAuthority("ROLE_" + rol));
	}

	@Override
	public String getPassword() {
		return null;
	}

	@Override
	public String getUsername() {
		return username;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}
}
