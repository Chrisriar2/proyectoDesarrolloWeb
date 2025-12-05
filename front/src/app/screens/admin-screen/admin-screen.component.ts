import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { FacadeService } from 'src/app/services/facade.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-screen',
  templateUrl: './admin-screen.component.html',
  styleUrls: ['./admin-screen.component.scss']
})
export class AdminScreenComponent implements OnInit {
  // Variables y métodos del componente
  public name_user:string = "";
  public lista_admins:any[]= [];
  public rol: string = "";
  
  constructor(
    public facadeService: FacadeService,
    private administradoresService: AdministradoresService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // Lógica de inicialización aquí
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();

    // Obtenemos los administradores
    this.obtenerAdmins();
  }

  //Obtener lista de usuarios
  public obtenerAdmins(){
    this.administradoresService.obtenerListaAdmins().subscribe(
      (response)=>{
        this.lista_admins = response;
        console.log("Lista users: ", this.lista_admins);
      }, (error)=>{
        alert("No se pudo obtener la lista de administradores");
      }
    );
  }

  public goEditar(idUser: number){
    this.router.navigate(["registro-usuarios/administrador/"+idUser]);
  }

  public delete(idUser: number) {
      const userId = Number(this.facadeService.getUserId());
      console.log("UserID del token: ", userId);
      console.log("Rol del usuario: ", this.rol);
      console.log("ID del usuario a eliminar: ", idUser);
      if (this.rol === 'administrador') {
        const dialogRef = this.dialog.open(EliminarUserModalComponent, {
          width: '328px',
          height: "288px",
          data: { id: idUser, rol:'administrador'}
        });
        dialogRef.afterClosed().subscribe(result => {
        if (result && result.isDelete) {
          // Si se eliminó el usuario, refrescar la lista
          console.log("Administrador eliminado, refrescando lista...");
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
