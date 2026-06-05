package com.mlooker.api.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.mlooker.api.controller.dto.LoginRequest;
import com.mlooker.api.controller.dto.LoginResponse;
import com.mlooker.api.controller.dto.UsuarioMeResponse;
import com.mlooker.api.entity.Creador;
import com.mlooker.api.entity.Usuario;
import com.mlooker.api.repository.CreadorRepository;
import com.mlooker.api.repository.UsuarioRepository;
import com.mlooker.api.security.UserPrincipal;

@Service
public class AuthService {

	private final UsuarioRepository usuarioRepository;
	private final CreadorRepository creadorRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;

	public AuthService(
			UsuarioRepository usuarioRepository,
			CreadorRepository creadorRepository,
			PasswordEncoder passwordEncoder,
			JwtService jwtService) {
		this.usuarioRepository = usuarioRepository;
		this.creadorRepository = creadorRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtService = jwtService;
	}

	public LoginResponse login(LoginRequest request) {
		Usuario usuario = usuarioRepository.findByUsername(request.username().trim().toLowerCase())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario o contraseña incorrectos"));

		if (!passwordEncoder.matches(request.password(), usuario.getPassword())) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario o contraseña incorrectos");
		}

		boolean verificado = isCreadorVerificado(usuario);
		String token = jwtService.generateToken(usuario, verificado);

		return new LoginResponse(
				token,
				usuario.getUsername(),
				usuario.getNombre(),
				usuario.getRol(),
				usuario.getInversorId(),
				usuario.getCreadorId(),
				verificado);
	}

	public UsuarioMeResponse me() {
		UserPrincipal principal = currentPrincipal();
		return new UsuarioMeResponse(
				principal.getUsername(),
				principal.getNombre(),
				principal.getRol(),
				principal.getInversorId(),
				principal.getCreadorId(),
				principal.isVerificado());
	}

	public void requireInversor(Long inversorId) {
		UserPrincipal principal = currentPrincipal();
		if (!"INVERSOR".equals(principal.getRol())
				|| principal.getInversorId() == null
				|| !principal.getInversorId().equals(inversorId)) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No puedes operar con esta cuenta de inversor");
		}
	}

	public void requireCreadorVerificado(Long creadorId) {
		UserPrincipal principal = currentPrincipal();
		if (!"CREADOR".equals(principal.getRol())
				|| principal.getCreadorId() == null
				|| !principal.getCreadorId().equals(creadorId)) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No puedes publicar en nombre de este creador");
		}
		if (!principal.isVerificado()) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo artistas verificados pueden publicar obras");
		}
	}

	public UserPrincipal currentPrincipal() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal principal)) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Debes iniciar sesión");
		}
		return principal;
	}

	private boolean isCreadorVerificado(Usuario usuario) {
		if (!"CREADOR".equals(usuario.getRol()) || usuario.getCreadorId() == null) {
			return false;
		}
		return creadorRepository.findById(usuario.getCreadorId())
				.map(Creador::isVerificado)
				.orElse(false);
	}
}
