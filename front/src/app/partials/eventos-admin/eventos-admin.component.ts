import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EventosService } from 'src/app/services/eventos.service';
import { FacadeService } from 'src/app/services/facade.service'; 
import { EventoModalComponent } from 'src/app/modals/evento-modal/evento-modal.component';
import { ConfirmDialogComponent } from 'src/app/modals/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-eventos-admin',
  templateUrl: './eventos-admin.component.html',
  styleUrls: ['./eventos-admin.component.scss']
})
export class EventosAdminComponent implements OnInit {

  // Columnas base (Visibles para Maestros y Admins)
  displayedColumns: string[] = ['id', 'titulo', 'tipo', 'fecha_inicio', 'ubicacion', 'cupo'];
  
  // Fuente de datos para la tabla Material
  dataSource = new MatTableDataSource<any>([]);
  
  // Paginador
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Bandera de seguridad
  public esAdmin: boolean = false;

  constructor(
    private eventosService: EventosService,
    private facadeService: FacadeService, 
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // 1. Verificar el Rol del Usuario
    const rol = this.facadeService.getUserGroup();
    
    // Solo si es 'administrador' activamos los poderes de edición
    this.esAdmin = (rol === 'administrador');

    // 2. Si es Admin, agregamos la columna de acciones a la tabla
    if (this.esAdmin) {
      this.displayedColumns.push('acciones');
    }

    // 3. Cargar datos
    this.cargarEventos();
  }

  public cargarEventos() {
    this.eventosService.obtenerEventos().subscribe(
      (response) => {
        // Asignamos datos a la tabla
        this.dataSource.data = response;
        this.dataSource.paginator = this.paginator;
      },
      (error) => console.error("Error al cargar eventos:", error)
    );
  }

  // Buscador rápido en tabla
  public aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // --- ACCIONES PROTEGIDAS (Solo Admin) ---

  public eliminarEvento(id: number) {
    if (!this.esAdmin) return; // Candado de seguridad

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: '¿Verdaderamente deseas eliminar este evento? Esta acción no se puede deshacer.' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eventosService.eliminarEvento(id).subscribe(
          () => {
            this.cargarEventos(); 
            alert("Evento eliminado correctamente"); 
          },
          (error) => alert("No se pudo eliminar: " + (error.error.details || "Error del servidor"))
        );
      }
    });
  }

  public abrirModalCrear() {
    if (!this.esAdmin) return; // Candado de seguridad

    const dialogRef = this.dialog.open(EventoModalComponent, {
      width: '600px',
      data: null // Null indica que es NUEVO
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.cargarEventos();
    });
  }

  public abrirModalEditar(evento: any) {
    if (!this.esAdmin) return; // Candado de seguridad

    const dialogRef = this.dialog.open(EventoModalComponent, {
      width: '600px',
      data: evento // Pasamos el objeto para editar
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.cargarEventos();
    });
  }
}