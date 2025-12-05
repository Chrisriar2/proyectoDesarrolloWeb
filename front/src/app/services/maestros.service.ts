import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FacadeService } from './facade.service';
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
export class MaestrosService {

  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService,
  ) {}

  public esquemaMaestro() {
    return {
      rol: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmar_password: '',

// Campos específicos de maestro
      id_trabajador: '',
      fecha_nacimiento: '',     // 'YYYY-MM-DD'
      telefono: '',
      rfc: '',
      cubiculo: '',
      edad: '',
      area_investigacion: '',
      materias_json: [] as string[]
    };
  }

  // Validación para el formulario de Maestros
  public validarMaestro(data: any, editar: boolean) {
    console.log('Validando maestro...', data);
    const error: any = {};

    // ID de trabajador (9 dígitos)
    if (!this.validatorService.required(data['id_trabajador'])) {
      error['id_trabajador'] = this.errorService.required;
    } 
    else if (!this.validatorService.noSpaces(data['id_trabajador'])) {
      error['id_trabajador'] = this.errorService.noSpaces;
    } else if (!this.validatorService.alphaNum(data['id_trabajador'])) {
      error['id_trabajador'] = this.errorService.onlyAlnum;
    } else if (!this.validatorService.min(data['id_trabajador'], 9)) {
      error['id_trabajador'] = this.errorService.minLen;
    } else if (!this.validatorService.max(data['id_trabajador'], 9)) {
      error['id_trabajador'] = this.errorService.maxLen;
    }

    // Nombre y apellidos
    if (!this.validatorService.required(data['first_name'])) {
      error['first_name'] = this.errorService.required;
    }
    else if(!this.validatorService.words(data['first_name'])){
      error['first_name'] = 'El nombre solo debe contener letras y espacios';
    }
    if (!this.validatorService.required(data['last_name'])) {
      error['last_name'] = this.errorService.required;
    }
    else if(!this.validatorService.words(data['last_name'])){
      error['last_name'] = 'Los apellidos solo debe contener letras y espacios';
    }

    // Email
    if (!this.validatorService.required(data['email'])) {
      error['email'] = this.errorService.required;
    } else if (!this.validatorService.max(data['email'], 40)) {
      error['email'] = this.errorService.max(40);
    } else if (!this.validatorService.email(data['email'])) {
      error['email'] = this.errorService.email;
    }

    // Passwords (solo al crear)
    if (!editar) {
      if (!this.validatorService.required(data['password'])) {
        error['password'] = this.errorService.required;
      }
      if (!this.validatorService.required(data['confirmar_password'])) {
        error['confirmar_password'] = this.errorService.required;
      }
      if (this.validatorService.required(data['password']) &&
          this.validatorService.required(data['confirmar_password']) &&
          data['password'] !== data['confirmar_password']) {
        error['confirmar_password'] = 'Las contraseñas no coinciden';
        alert('Las contraseñas no coinciden');
      }
    }

    // Fecha de nacimiento
    if (!this.validatorService.required(data['fecha_nacimiento'])) {
      error['fecha_nacimiento'] = this.errorService.required;
    }

    // Teléfono (con máscara en UI)
    if (!this.validatorService.required(data['telefono'])) {
      error['telefono'] = this.errorService.required;
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

    // RFC (12-13)
    if (!this.validatorService.required(data['rfc'])) {
      error['rfc'] = this.errorService.required;
    } else if (!this.validatorService.min(data['rfc'], 12)) {
      error['rfc'] = this.errorService.min(12);
      alert('La longitud de caracteres del RFC es menor, deben ser 12 o 13');
    } else if (!this.validatorService.max(data['rfc'], 13)) {
      error['rfc'] = this.errorService.max(13);
      alert('La longitud de caracteres del RFC es mayor, deben ser 13');
    }

    // Cubículo
    if (!this.validatorService.required(data['cubiculo'])) {
      error['cubiculo'] = this.errorService.required;
    } else if (!this.validatorService.max(data['cubiculo'], 30)) {
      error['cubiculo'] = this.errorService.max(30);
    }

    // Edad (numérica, mínima 15 para alumno)
    if (!this.validatorService.required(data['edad'])) {
      error['edad'] = this.errorService.required;
    } else if (!this.validatorService.numeric(data['edad'])) {
      alert('El formato de la edad es solo números');
    } else if (+data['edad'] < 18) {
      error['edad'] = 'La edad debe ser mayor o igual a 18';
    } 

    // Área de investigación (select)
    if (!this.validatorService.required(data['area_investigacion'])) {
      error['area_investigacion'] = this.errorService.required;
    } else if (!this.validatorService.words(data['area_investigacion'])) {
      error['area_investigacion'] = 'El área de investigación solo debe contener letras y espacios';
    }

    // Materias (al menos una)
    if (!Array.isArray(data['materias_json']) || data['materias_json'].length === 0) {
      error['materias_json'] = 'Selecciona al menos una materia';
      alert('Debes seleccionar al menos una materia a impartir');
    }

    return error;
  }

  // Registrar maestro 
  public registrarMaestro(data: any) {
    // Verificamos si existe el tocken de sesión
    const token = this.facadeService.getSessionToken();
    let headers:HttpHeaders;
    if (token) {
      headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token});
    } else {
      headers = new HttpHeaders({'Content-Type': 'application/json'});
    }
    return this.http.post(`${environment.url_api}/api/maestros/`, data, httpOptions);
  }

  // Obtener lista de maestros
  public obtenerListaMaestros() {
    // Verificamos si existe el tocken de sesión
    const token = this.facadeService.getSessionToken();
    let headers:HttpHeaders;
    if (token) {
      headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token});
    } else {
      headers = new HttpHeaders({'Content-Type': 'application/json'});
    }
    return this.http.get<any[]>(`${environment.url_api}/api/maestros-all/`, { headers: headers });
  }

   // Obtener datos de un Maestro por su ID
    public obtenerMaestroPorId(id:number): Observable<any> {
      const token = this.facadeService.getSessionToken();
      let headers: HttpHeaders;
      if (token) {
        headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
      } else {
        headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        console.log("No se encontró el token del usuario");
      }
      return this.http.get<any>(`${environment.url_api}/api/maestros/?id=${id}`, { headers });
    }


  // Actualizar maestro
  public actualizarMaestro(data: any ) {
    // Verificamos si existe el tocken de sesión
    const token = this.facadeService.getSessionToken();
    let headers:HttpHeaders;
    if (token) {
      headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token});
    } else {
      headers = new HttpHeaders({'Content-Type': 'application/json'});
    }
    return this.http.put(`${environment.url_api}/api/maestros/`, data, { headers });
  }

  // Eliminar maestro por su ID
  public eliminarMaestro(id:number) {
    // Verificamos si existe el tocken de sesión
    const token = this.facadeService.getSessionToken();
    let headers:HttpHeaders;
    if (token) {
      headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token});
    } else {
      headers = new HttpHeaders({'Content-Type': 'application/json'});
    }
    return this.http.delete(`${environment.url_api}/api/maestros/?id=${id}`, { headers });
  }
}
