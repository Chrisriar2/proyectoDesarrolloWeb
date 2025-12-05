import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { MaestrosService } from 'src/app/services/maestros.service';
import { MatDialog } from '@angular/material/dialog';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-maestros-screen',
  templateUrl: './maestro-screen.component.html',
  styleUrls: ['./maestro-screen.component.scss']
})
export class MaestrosScreenComponent implements OnInit {

  public name_user: string = "";
  public rol: string = "";
  public token: string = "";
  public lista_maestros: any[] = [];

  //Para la tabla
  displayedColumns: string[] = ['id_trabajador', 'nombre', 'email', 'fecha_nacimiento', 'telefono', 'rfc', 'cubiculo', 'area_investigacion', 'editar', 'eliminar'];
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
    public maestrosService: MaestrosService,
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
    this.obtenerMaestros();
  }

  //Obtener maestros
  public obtenerMaestros() {
    this.maestrosService.obtenerListaMaestros().subscribe(
      (response) => {
        this.lista_maestros = response;
        if (this.lista_maestros.length > 0) {
          //Agregar datos del nombre e email
          this.lista_maestros.forEach(usuario => {
            usuario.first_name = usuario.user.first_name;
            usuario.last_name = usuario.user.last_name;
            usuario.email = usuario.user.email;
          });

          this.dataSource.data = this.lista_maestros as DatosUsuario[];
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

  // Normalizamos el valor: sin espacios al inicio/fin y en minúsculas
  this.dataSource.filter = value.trim().toLowerCase();

  // Opcional pero recomendable: al filtrar, regresar a la primera página
  if (this.paginator) {
    this.paginator.firstPage();
  }
}


  public goEditar(idUser: number) {
    this.router.navigate(["registro-usuarios/maestros/" + idUser]);
  }

  public delete(idUser: number) {
    const userId = Number(this.facadeService.getUserId());
    if (this.rol === 'administrador' || (this.rol === 'maestro' && userId === idUser)) {
      const dialogRef = this.dialog.open(EliminarUserModalComponent, {
        width: '328px',
        height: "288px",
        data: { id: idUser, rol: 'maestro' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.isDelete) {
          // Si se eliminó el usuario, refrescar la lista
          console.log("Maestro eliminado, refrescando lista...");
          window.location.reload();
        }
        else {
          alert("Eliminación fallida.");
          console.log("Eliminación fallida.");
        }
    }
    );
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
