package com.mlooker.api.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.mlooker.api.entity.Activo;
import com.mlooker.api.entity.Creador;
import com.mlooker.api.entity.Inversor;
import com.mlooker.api.repository.ActivoRepository;
import com.mlooker.api.repository.CreadorRepository;
import com.mlooker.api.repository.InversorRepository;

@Component
@Profile("local")
public class DemoDataLoader implements CommandLineRunner {

	private final CreadorRepository creadorRepository;
	private final ActivoRepository activoRepository;
	private final InversorRepository inversorRepository;

	public DemoDataLoader(
			CreadorRepository creadorRepository,
			ActivoRepository activoRepository,
			InversorRepository inversorRepository) {
		this.creadorRepository = creadorRepository;
		this.activoRepository = activoRepository;
		this.inversorRepository = inversorRepository;
	}

	@Override
	public void run(String... args) {
		if (activoRepository.count() > 0) {
			return;
		}

		Creador quevedo = crearCreador("Quevedo", "quevedo@mlooker.demo");
		Creador laPantera = crearCreador("La Pantera", "pantera@mlooker.demo");
		Creador lucho = crearCreador("Lucho RK", "lucho@mlooker.demo");

		crearActivo("Buenas Noches", "MUSICA", 1450.0, 100, 38.0, quevedo);
		crearActivo("Cayo la Noche", "MUSICA", 920.0, 100, 57.0, laPantera);
		crearActivo("Tour Maleante", "MUSICA", 1680.0, 100, 24.0, lucho);
		crearActivo("Columbia", "MUSICA", 1100.0, 100, 43.0, quevedo);

		Inversor demo = new Inversor();
		demo.setNombre("Alex Rivera");
		demo.setSaldo(12450.86);
		inversorRepository.save(demo);
	}

	private Creador crearCreador(String nombre, String email) {
		Creador creador = new Creador();
		creador.setNombre(nombre);
		creador.setEmail(email);
		return creadorRepository.save(creador);
	}

	private void crearActivo(
			String titulo,
			String tipo,
			double precioTotal,
			int fracciones,
			double disponible,
			Creador creador) {
		Activo activo = new Activo();
		activo.setTitulo(titulo);
		activo.setTipo(tipo);
		activo.setPrecioTotal(precioTotal);
		activo.setCantidadFracciones(fracciones);
		activo.setRendimientoMensual(precioTotal / fracciones);
		activo.setPorcentajeDisponible(disponible);
		activo.setCreador(creador);
		activoRepository.save(activo);
	}
}
