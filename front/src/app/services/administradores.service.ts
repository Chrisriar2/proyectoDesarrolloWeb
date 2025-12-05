import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FacadeService } from './facade.service'; // Asegúrate de que la ruta sea correcta (quizás ../facade.service)
import { ErrorsService } from './tools/errors.service';
import { ValidatorService } from './tools/validator.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AdministradoresService {

  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService
  ) { }

  // --- AQUÍ ESTÁ EL MÉTODO QUE FALTABA (CORREGIDO) ---
  public obtenerTotalUsuarios(): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    
    // Petición al endpoint que creamos en Django
    return this.http.get<any>(`${environment.url_api}/user-stats/`, { headers });
  }
  // ----------------------------------------------------

  public esquemaAdmin(){
    return {
      'rol':'',
      'clave_admin': '',
      'first_name': '',
      'last_name': '',
      'email': '',
      'password': '',
      'confirmar_password': '',
      'telefono': '',
      'rfc': '',
      'edad': '',
      'ocupacion': ''
    }
  }

  //Validación para el formulario
  public validarAdmin(data: any, editar: boolean){
    console.log("Validando admin... ", data);
    let error: any = {};

    //Validaciones
    if (!this.validatorService.required(data["clave_admin"])) {
      error['clave_admin'] = this.errorService.required;
    } else if (!this.validatorService.noSpaces(data["clave_admin"])) {
      error['clave_admin'] = this.errorService.noSpaces;
    } else if (!this.validatorService.alphaNum(data["clave_admin"])) {
      error['clave_admin'] = this.errorService.onlyAlnum;
    }

    if(!this.validatorService.required(data["first_name"])){
      error["first_name"] = this.errorService.required;
    } else if(!this.validatorService.words(data["first_name"])){
      error["first_name"] = 'El nombre solo debe contener letras y espacios';
    }

    if(!this.validatorService.required(data["last_name"])){
      error["last_name"] = this.errorService.required;
    } else if(!this.validatorService.words(data["last_name"])){
      error["last_name"] = 'Los apellidos solo debe contener letras y espacios';
    }

    if(!this.validatorService.required(data["email"])){
      error["email"] = this.errorService.required;
    }else if(!this.validatorService.max(data["email"], 40)){
      error["email"] = this.errorService.max(40);
    }else if (!this.validatorService.email(data['email'])) {
      error['email'] = this.errorService.email;
    }

    if(!editar){
      if(!this.validatorService.required(data["password"])){
        error["password"] = this.errorService.required;
      }

      if(!this.validatorService.required(data["confirmar_password"])){
        error["confirmar_password"] = this.errorService.required;
      }

      if(this.validatorService.required(data["password"]) && this.validatorService.required(data["confirmar_password"])){
        if(data["password"] != data["confirmar_password"]){
          error["confirmar_password"] = "Las contraseñas no coinciden";
        }
      }
    }

    if(!this.validatorService.required(data["rfc"])){
      error["rfc"] = this.errorService.required;
    }else if(!this.validatorService.min(data["rfc"], 12)){
      error["rfc"] = this.errorService.min(12);
      alert("La longitud de caracteres deL RFC es menor, deben ser 12");
    }else if(!this.validatorService.max(data["rfc"], 13)){
      error["rfc"] = this.errorService.max(13);
      alert("La longitud de caracteres deL RFC es mayor, deben ser 13");
    }else if(!this.validatorService.alphaNum(data["rfc"])){
      error["rfc"] = this.errorService.onlyAlnum;
      alert("El formato del RFC es incorrecto");
    }

    if(!this.validatorService.required(data["edad"])){
      error["edad"] = this.errorService.required;
    }else if(!this.validatorService.numeric(data["edad"])){
      alert("El formato es solo números");
    }else if(data["edad"]<18){
      error["edad"] = "La edad debe ser mayor o igual a 18";
    }

    if(!this.validatorService.required(data["telefono"])){
      error["telefono"] = this.errorService.required;
    } else if (!this.validatorService.min(data['telefono'], 10)) {
      error['telefono'] = this.errorService.min(10);
      alert('El formato del teléfono es incorrecto');
    } else if (!this.validatorService.max(data['telefono'], 10)) {
      error['telefono'] = this.errorService.max(10);
      alert('El formato del teléfono es incorrecto');
    } else if (!this.validatorService.numeric(data['telefono'])) {
      error['telefono'] = 'El teléfono debe contener solo números';
      alert('El formato del teléfono es incorrecto');
    }

    if(!this.validatorService.required(data["ocupacion"])){
      error["ocupacion"] = this.errorService.required;
    } else if(!this.validatorService.words(data["ocupacion"])){
      error["ocupacion"] = 'La ocupación solo debe contener letras y espacios';
    }
    

    //Return arreglo
    return error;
  }

  //Registrar admin
  public registrarAdmin(data: any) {
    // Verificamos si existe el tocken de sesión
    const token = this.facadeService.getSessionToken();
    let headers:HttpHeaders;
    if (token) {
      headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token});
    } else {
      headers = new HttpHeaders({'Content-Type': 'application/json'});
    }
    return this.http.post(`${environment.url_api}/api/admins/`, data, httpOptions);
  }

   // Petición para obtener la lista de administradores
  public obtenerListaAdmins(): Observable<any>{
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      console.log("No se encontró el token del usuario");

    }
    return this.http.get<any>(`${environment.url_api}/api/admins-all/`, { headers });
  }

  // Actualizar admin
  public actualizarAdmin(data: any ) {
    // Verificamos si existe el tocken de sesión
    const token = this.facadeService.getSessionToken();
    let headers:HttpHeaders;
    if (token) {
      headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token});
    } else {
      headers = new HttpHeaders({'Content-Type': 'application/json'});
    }
    return this.http.put(`${environment.url_api}/api/admins/`, data, { headers });
  }

  // Obtener datos de un admin por su ID
  public obtenerAdminPorId(id:number): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      console.log("No se encontró el token del usuario");
    }
    return this.http.get<any>(`${environment.url_api}/api/admins/?id=${id}`, { headers });
  }

  // Eliminar administrador por su ID
  public eliminarAdmin(id:number): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      console.log("No se encontró el token del usuario");
    }
    return this.http.delete<any>(`${environment.url_api}/api/admins/?id=${id}`, { headers });
  }

}