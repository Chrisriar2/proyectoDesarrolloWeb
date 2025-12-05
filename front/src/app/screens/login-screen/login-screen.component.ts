import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.scss']
})
export class LoginScreenComponent implements OnInit {
  //Variables para la vista
  public username:string = "";
  public password:string = "";
  public type: string = "password";
  public errors:any = {};
  public load:boolean = false;

  constructor(
    public router: Router,
    private facadeService: FacadeService
  ) { }

  ngOnInit(): void {

  }

  public login(){
    this.errors = {};
    this.errors = this.facadeService.validarLogin(this.username, this.password);
    if(Object.keys(this.errors).length > 0){
      return false;
    }
    this.load = true;
    // Llamar al servicio de login
    this.facadeService.login(this.username, this.password).subscribe(
      (response:any) => {
        console.log("Respuesta del login: ", response);
        // Guardar el token en el almacenamiento local - cookies
        this.facadeService.saveUserData(response);
        // Redirigir segun el rol del usuario
        const role = response.rol;
        if(role === 'administrador'){
          this.router.navigate(['/administrador']);
        }else if(role === 'alumno'){
          console.log("Navegando a alumnos");
          this.router.navigate(['/alumnos']);
        }else if(role === 'maestro'){
          this.router.navigate(['/maestros']);
        }else{
          this.router.navigate(['home']);
        }
        this.load = false;
      },
      (error:any) => {
        this.load = false;
        this.errors.general = "Credenciales incorrectas. Intente de nuevo.";
      }
    );

  }

  //Metodo para mostrar/ocultar la contraseña
  //Opción 1: Cambiar el tipo de input de password a text
  showHidePassword():void{
    if(this.type == "password"){
      this.type = "text";
    }else{
      this.type = "password";
    }
  }

  //Opción 2: Cambiar el icono de ojo abierto/cerrado
  public showPassword(){
    this.type = this.type === "password" ? "text" : "password";
  }

  public registrar(){
    this.router.navigate(["registro-usuarios"]);
  }

}
