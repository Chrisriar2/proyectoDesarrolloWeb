import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventosService } from 'src/app/services/eventos.service';

@Component({
  selector: 'app-evento-modal',
  templateUrl: './evento-modal.component.html',
  styleUrls: ['./evento-modal.component.scss']
})
export class EventoModalComponent implements OnInit {

  public actionTitle: string = "Nuevo Evento";
  public actionButton: string = "Registrar";
  public data: any = {};

  constructor(
    private dialogRef: MatDialogRef<EventoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public dataEvent: any,
    public eventosService: EventosService
  ) { }

  ngOnInit(): void {
    // 1. Inicializar datos base
    this.data = this.eventosService.esquemaEvento();

    // 2. Si es edición, cargar datos
    if (this.dataEvent) {
      this.actionTitle = "Editar Evento";
      this.actionButton = "Actualizar";
      this.data = { ...this.dataEvent };
    }
    
    // NOTA: Como usamos DatePicker + Time Input separados en el HTML,
    // Angular Material manejará la fecha como objeto Date y el time como string.
    // Necesitaremos unirlos antes de enviar.
  }

  public cerrarModal() {
    this.dialogRef.close();
  }

  public guardarEvento() {
    // Validar campos básicos
    if (!this.data.titulo || !this.data.fecha_inicio || !this.data.fecha_fin || !this.data.ubicacion) {
      alert("Faltan campos obligatorios");
      return;
    }

    // --- MAGIA DE FECHAS ---
    // Django espera: "YYYY-MM-DDTHH:mm:ss"
    // El input datetime-local ya lo hace casi bien, pero vamos a asegurarnos
    // de que tenga el formato correcto con la función auxiliar.
    
    const asegurarFormato = (fecha: string) => {
      // Si viene como "2023-10-10T10:00" (16 chars), le falta segundos
      if (fecha && fecha.length === 16) return fecha + ":00";
      return fecha;
    };

    // Validaciones Lógicas
    const fechaInicio = new Date(this.data.fecha_inicio);
    const fechaFin = new Date(this.data.fecha_fin);

    if (fechaInicio >= fechaFin) {
      alert("La fecha de fin debe ser mayor a la de inicio");
      return;
    }

    // Preparar objeto
    const eventoAEnviar = {
      ...this.data,
      cupo_maximo: Number(this.data.cupo_maximo),
      fecha_inicio: asegurarFormato(this.data.fecha_inicio),
      fecha_fin: asegurarFormato(this.data.fecha_fin)
    };

    // Enviar
    if (this.dataEvent) {
      this.eventosService.actualizarEvento(eventoAEnviar).subscribe(
        (response) => {
          this.dialogRef.close(true);
          alert("Evento actualizado");
        },
        (error) => alert("Error al actualizar: " + JSON.stringify(error.error))
      );
    } else {
      this.eventosService.registrarEvento(eventoAEnviar).subscribe(
        (response) => {
          this.dialogRef.close(true);
          alert("Evento creado");
        },
        (error) => alert("Error al crear: " + JSON.stringify(error.error))
      );
    }
  }
}