import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { FacadeService } from 'src/app/services/facade.service';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-alumno-screen',
  templateUrl: './alumno-screen.component.html',
  styleUrls: ['./alumno-screen.component.scss']
})
export class AlumnoScreenComponent implements OnInit {
   public name_user: string = "";
    public rol: string = "";
    public token: string = "";
    public lista_alumnos: any[] = [];
  
    //Para la tabla
    displayedColumns: string[] = ['matricula', 'nombre', 'email', 'fecha_nacimiento', 'telefono', 'curp' ,'editar', 'eliminar'];
    dataSource = new MatTableDataSource<DatosUsuario>([]);
  
    private paginator: MatPaginator | null = null;
    private sort: MatSort | null = null;
  
    @ViewChild(MatPaginator)
    set matPaginator(paginator: MatPaginator) {
      this.paginator = paginator;
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    }
  
    @ViewChild(MatSort)
    set matSort(sort: MatSort) {
      this.sort = sort;
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    }
  
    constructor(
      public facadeService: FacadeService,
      public alumnosService: AlumnosService,
      private router: Router,
      public dialog: MatDialog
    ) {
      this.configureSorting();
    }
  
    ngOnInit(): void {
      this.name_user = this.facadeService.getUserCompleteName();
      this.rol = this.facadeService.getUserGroup();
      //Validar que haya inicio de sesión
      //Obtengo el token del login
      this.token = this.facadeService.getSessionToken();
      console.log("Token: ", this.token);
      if(this.token == ""){
        this.router.navigate(["/"]);
      }
      //Obtener maestros
      this.obtenerAlumnos();
    }
  
    public obtenerAlumnos() {
      this.alumnosService.obtenerListaAlumnos().subscribe(
        (response) => {
          this.lista_alumnos = response;
          if (this.lista_alumnos.length > 0) {
            //Agregar datos del nombre e email
            this.lista_alumnos.forEach(usuario => {
              usuario.first_name = usuario.user.first_name;
              usuario.last_name = usuario.user.last_name;
              usuario.email = usuario.user.email;
            });
  
            this.dataSource.data = this.lista_alumnos as DatosUsuario[];
            console.log("Lista de alumnos: ", this.lista_alumnos);
          }
        }, (error) => {
          console.error("Error al obtener la lista de maestros: ", error);
          alert("No se pudo obtener la lista de maestros");
        }
      );
    }
  
    private configureSorting(): void {
      this.dataSource.sortingDataAccessor = (item: DatosUsuario, property: string) => {
        switch (property) {
          case 'nombre':
            return (item.first_name + ' ' + item.last_name).toLowerCase();
          default:
            return (item as any)[property];
        }
      };
  
       this.dataSource.filterPredicate = (data: DatosUsuario, filter: string): boolean => {
      const nombreCompleto = (data.first_name + ' ' + data.last_name).toLowerCase();
      return nombreCompleto.includes(filter);
    };
    }
  
    public applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value || '';
    this.dataSource.filter = value.trim().toLowerCase();
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }
  
  
    public goEditar(idUser: number) {
      this.router.navigate(["registro-usuarios/alumnos/" + idUser]);
    }
  
    public delete(idUser: number) {
        const userId = Number(this.facadeService.getUserId());
        if (this.rol === 'administrador' || (this.rol === 'maestro' && userId === idUser)) {
          const dialogRef = this.dialog.open(EliminarUserModalComponent, {
            width: '328px',
            height: "288px",
            data: { id: idUser, rol: 'alumno' }
          });
          dialogRef.afterClosed().subscribe(result => {
        if (result && result.isDelete) {
          // Si se eliminó el usuario, refrescar la lista
          console.log("Alumno eliminado, refrescando lista...");
          window.location.reload();
        }
        else {
          alert("Eliminación fallida.");
          console.log("Eliminación fallida.");
        }
        });
      }
    }
}

//Esto va fuera de la llave que cierra la clase
export interface DatosUsuario {
  id: number,
  id_trabajador: number;
  first_name: string;
  last_name: string;
  email: string;
  fecha_nacimiento: string,
  telefono: string,
  rfc: string,
  cubiculo: string,
  area_investigacion: number,
}
