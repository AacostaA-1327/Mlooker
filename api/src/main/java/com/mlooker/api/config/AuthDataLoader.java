package com.mlooker.api.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.mlooker.api.entity.Creador;
import com.mlooker.api.entity.Inversor;
import com.mlooker.api.entity.Usuario;
import com.mlooker.api.repository.CreadorRepository;
import com.mlooker.api.repository.InversorRepository;
import com.mlooker.api.repository.UsuarioRepository;

@Component
@Profile("local")
@Order(2)
public class AuthDataLoader implements CommandLineRunner {

	private record ArtistSeed(String username, String nombre, String email) {
	}

	private static final ArtistSeed[] ARTISTS = {
			new ArtistSeed("quevedo", "Quevedo", "quevedo@mlooker.demo"),
			new ArtistSeed("lapantera", "La Pantera", "pantera@mlooker.demo"),
			new ArtistSeed("luchork", "Lucho RK", "lucho@mlooker.demo"),
			new ArtistSeed("rosalia", "Rosalía", "rosalia@mlooker.demo"),
			new ArtistSeed("badbunny", "Bad Bunny", "badbunny@mlooker.demo"),
			new ArtistSeed("drake", "Drake", "drake@mlooker.demo"),
			new ArtistSeed("taylorswift", "Taylor Swift", "taylorswift@mlooker.demo"),
			new ArtistSeed("billieeilish", "Billie Eilish", "billieeilish@mlooker.demo"),
			new ArtistSeed("shakira", "Shakira", "shakira@mlooker.demo"),
			new ArtistSeed("eminem", "Eminem", "eminem@mlooker.demo"),
	};

	private final UsuarioRepository usuarioRepository;
	private final CreadorRepository creadorRepository;
	private final InversorRepository inversorRepository;
	private final PasswordEncoder passwordEncoder;

	public AuthDataLoader(
			UsuarioRepository usuarioRepository,
			CreadorRepository creadorRepository,
			InversorRepository inversorRepository,
			PasswordEncoder passwordEncoder) {
		this.usuarioRepository = usuarioRepository;
		this.creadorRepository = creadorRepository;
		this.inversorRepository = inversorRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	public void run(String... args) {
		markExistingCreadoresVerificados();

		Inversor cliente = ensureClienteInversor();
		ensureUsuario("cliente", "cliente", "INVERSOR", "Cliente Demo", cliente.getId(), null);

		for (ArtistSeed artist : ARTISTS) {
			Creador creador = ensureCreador(artist.nombre(), artist.email());
			creador.setVerificado(true);
			creadorRepository.save(creador);
			ensureUsuario(
					artist.username(),
					artist.username(),
					"CREADOR",
					artist.nombre(),
					null,
					creador.getId());
		}
	}

	private void ensureUsuario(
			String username,
			String rawPassword,
			String rol,
			String nombre,
			Long inversorId,
			Long creadorId) {
		if (usuarioRepository.findByUsername(username).isPresent()) {
			return;
		}
		createUsuario(username, rawPassword, rol, nombre, inversorId, creadorId);
	}

	private void markExistingCreadoresVerificados() {
		for (ArtistSeed artist : ARTISTS) {
			creadorRepository.findByEmail(artist.email()).ifPresent(creador -> {
				creador.setNombre(artist.nombre());
				creador.setVerificado(true);
				creadorRepository.save(creador);
			});
		}
	}

	private Inversor ensureClienteInversor() {
		return inversorRepository.findAll().stream()
				.filter(inv -> "Alex Rivera".equalsIgnoreCase(inv.getNombre()))
				.findFirst()
				.orElseGet(() -> {
					Inversor demo = new Inversor();
					demo.setNombre("Cliente Demo");
					demo.setSaldo(10000.0);
					return inversorRepository.save(demo);
				});
	}

	private Creador ensureCreador(String nombre, String email) {
		return creadorRepository.findByEmail(email).orElseGet(() -> {
			Creador creador = new Creador();
			creador.setNombre(nombre);
			creador.setEmail(email);
			creador.setVerificado(true);
			return creadorRepository.save(creador);
		});
	}

	private void createUsuario(
			String username,
			String rawPassword,
			String rol,
			String nombre,
			Long inversorId,
			Long creadorId) {
		Usuario usuario = new Usuario();
		usuario.setUsername(username);
		usuario.setPassword(passwordEncoder.encode(rawPassword));
		usuario.setRol(rol);
		usuario.setNombre(nombre);
		usuario.setInversorId(inversorId);
		usuario.setCreadorId(creadorId);
		usuarioRepository.save(usuario);
	}
}
