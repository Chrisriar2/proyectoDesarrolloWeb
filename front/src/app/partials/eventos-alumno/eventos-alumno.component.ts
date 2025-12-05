import { Component, OnInit } from '@angular/core';
import { EventosService } from 'src/app/services/eventos.service';

@Component({
  selector: 'app-eventos-alumno',
  templateUrl: './eventos-alumno.component.html',
  styleUrls: ['./eventos-alumno.component.scss']
})
export class EventosAlumnoComponent implements OnInit {

  public listaEventos: any[] = [];
  public misInscripciones: number[] = []; // Aquí guardaremos los IDs de tus eventos

  constructor(private eventosService: EventosService) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  public cargarDatos() {
    // 1. Cargar la lista de todos los eventos
    this.eventosService.obtenerEventos().subscribe(
      (response) => {
        this.listaEventos = response;
      },
      (error) => console.error("Error cargando eventos:", error)
    );

    // 2. Cargar MIS inscripciones para saber a cuáles ya le di click
    this.eventosService.obtenerMisInscripciones().subscribe(
      (response) => {
        console.log("Mis inscripciones:", response);
        this.misInscripciones = response; // Esto será un array como [1, 5, 8]
      },
      (error) => console.error("Error cargando inscripciones:", error)
    );
  }

  // Helper para saber si estoy inscrito en X evento
  public esInscrito(idEvento: number): boolean {
    return this.misInscripciones.includes(idEvento);
  }

  public inscribirse(id: number) {
    if(!confirm("¿Deseas inscribirte a este evento?")) return;

    this.eventosService.inscribirseEvento(id).subscribe(
      () => {
        alert("¡Inscripción exitosa!");
        this.cargarDatos(); // Recargamos para actualizar cupos y botones
      },
      (error) => {
        alert("No se pudo inscribir: " + (error.error.error || "Error desconocido"));
      }
    );
  }

  public desinscribirse(id: number) {
    if(!confirm("¿Seguro que quieres cancelar tu registro?")) return;

    this.eventosService.desinscribirseEvento(id).subscribe(
      () => {
        alert("Te has dado de baja del evento.");
        this.cargarDatos(); // Recargamos para liberar el cupo visualmente
      },
      (error) => {
        alert("Error al salir: " + (error.error.error || "Error desconocido"));
      }
    );
  }
}
