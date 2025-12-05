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
export class AlumnosService {

  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService
  ) { }

  public esquemaAlumno() {
    return {
      rol: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmar_password: '',
      
      //  Campos específicos de alumno 
      matricula: '',
      fecha_nacimiento: '',   // formato esperado: 'YYYY-MM-DD'
      curp: '',
      rfc: '',
      edad: '',
      telefono: '',
      ocupacion: ''
    };
  }

  // Validación para el formulario de Alumnos
  public validarAlumno(data: any, editar: boolean) {
    console.log('Validando alumno... ', data);
    const error: any = {};

    // Matrícula (9 dígitos)
    if (!this.validatorService.required(data['matricula'])) {
      error['matricula'] = this.errorService.required;
    }
     else if (!this.validatorService.noSpaces(data['matricula'])) {
      error['matricula'] = this.errorService.noSpaces;
    } else if (!this.validatorService.alphaNum(data['matricula'])) {
      error['matricula'] = this.errorService.onlyAlnum;
    }
    else if (!this.validatorService.numeric(data['matricula'])) {
      error['matricula'] = 'La matrícula debe contener solo números';
      alert('El formato de la matrícula es solo números');
    } else if (!this.validatorService.min(data['matricula'], 9)) {
      error['matricula'] = this.errorService.min(9);
      alert('La matrícula debe tener 9 dígitos');
    } else if (!this.validatorService.max(data['matricula'], 9)) {
      error['matricula'] = this.errorService.max(9);
      alert('La matrícula debe tener 9 dígitos');
    }

    // Nombre
    if (!this.validatorService.required(data['first_name'])) {
      error['first_name'] = this.errorService.required;
    }

    // Apellidos
    if (!this.validatorService.required(data['last_name'])) {
      error['last_name'] = this.errorService.required;
    }

    // Email
    if (!this.validatorService.required(data['email'])) {
      error['email'] = this.errorService.required;
    } else if (!this.validatorService.max(data['email'], 40)) {
      error['email'] = this.errorService.max(40);
    } else if (!this.validatorService.email(data['email'])) {
      error['email'] = this.errorService.email;
    }

    // Passwords (solo al crear, no al editar)
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

    // Fecha de nacimiento (string 'YYYY-MM-DD')
    if (!this.validatorService.required(data['fecha_nacimiento'])) {
      error['fecha_nacimiento'] = this.errorService.required;
    }

    // CURP (18 caracteres)
    if (!this.validatorService.required(data['curp'])) {
      error['curp'] = this.errorService.required;
    } else if (!this.validatorService.min(data['curp'], 18)) {
      error['curp'] = this.errorService.min(18);
      alert('La longitud de la CURP es menor, deben ser 18 caracteres');
    } else if (!this.validatorService.max(data['curp'], 18)) {
      error['curp'] = this.errorService.max(18);
      alert('La longitud de la CURP es mayor, deben ser 18 caracteres');
    } else if (!this.validatorService.alphaNum(data['curp'])) {
      error['curp'] = this.errorService.onlyAlnum;
    }
    // RFC (12 o 13)
    if (!this.validatorService.required(data['rfc'])) {
      error['rfc'] = this.errorService.required;
    } else if (!this.validatorService.min(data['rfc'], 12)) {
      error['rfc'] = this.errorService.min(12);
      alert('La longitud de caracteres del RFC es menor, deben ser 12 o 13');
    } else if (!this.validatorService.max(data['rfc'], 13)) {
      error['rfc'] = this.errorService.max(13);
      alert('La longitud de caracteres del RFC es mayor, deben ser 13');
    } else if (!this.validatorService.alphaNum(data['rfc'])) {
      error['rfc'] = this.errorService.onlyAlnum;
    }

    // Edad (numérica, mínima 15 para alumno)
    if (!this.validatorService.required(data['edad'])) {
      error['edad'] = this.errorService.required;
    } else if (!this.validatorService.numeric(data['edad'])) {
      alert('El formato de la edad es solo números');
    } else if (+data['edad'] < 15) {
      error['edad'] = 'La edad debe ser mayor o igual a 15';
    }

    // Teléfono
    if (!this.validatorService.required(data['telefono'])) {
      error['telefono'] = this.errorService.required;
    }
    else if (!this.validatorService.min(data['telefono'], 10)) {
      error['telefono'] = this.errorService.min(10);
      alert('El formato del teléfono es incorrecto');
    } else if (!this.validatorService.max(data['telefono'], 10)) {
      error['telefono'] = this.errorService.max(10);
      alert('El formato del teléfono es incorrecto');
    } else if (!this.validatorService.numeric(data['telefono'])) {
      error['telefono'] = 'El teléfono debe contener solo números';
      alert('El formato del teléfono es incorrecto');
    } 

    // Ocupación
    if (!this.validatorService.required(data['ocupacion'])) {
      error['ocupacion'] = this.errorService.required;
    } else if (!this.validatorService.words(data['ocupacion'])) {
      error['ocupacion'] = 'La ocupación solo debe contener letras y espacios';
    }

    // Retornar arreglo de errores
    return error;
  }

  // Registrar alumno
  public registrarAlumno(data: any) {
    // Verificamos si existe el tocken de sesión
    const token = this.facadeService.getSessionToken();
    let headers:HttpHeaders;
    if (token) {
      headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token});
    } else {
      headers = new HttpHeaders({'Content-Type': 'application/json'});
    }
    return this.http.post(`${environment.url_api}/api/alumnos/`, data, httpOptions);
  }

   // Obtener lista de maestros
  public obtenerListaAlumnos() {
    // Verificamos si existe el tocken de sesión
    const token = this.facadeService.getSessionToken();
    let headers:HttpHeaders;
    if (token) {
      headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token});
    } else {
      headers = new HttpHeaders({'Content-Type': 'application/json'});
    }
    return this.http.get<any[]>(`${environment.url_api}/api/alumnos-all/`, { headers: headers });
  }

   // Obtener datos de un Alumno por su ID
    public obtenerAlumnoPorId(id:number): Observable<any> {
      const token = this.facadeService.getSessionToken();
      let headers: HttpHeaders;
      if (token) {
        headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
      } else {
        headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        console.log("No se encontró el token del usuario");
      }
      return this.http.get<any>(`${environment.url_api}/api/alumnos/?id=${id}`, { headers });
    }
  


  // Actualizar alumno
  public actualizarAlumno(data: any ) {
    // Verificamos si existe el tocken de sesión
    const token = this.facadeService.getSessionToken();
    let headers:HttpHeaders;
    if (token) {
      headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token});
    } else {
      headers = new HttpHeaders({'Content-Type': 'application/json'});
    }
    return this.http.put(`${environment.url_api}/api/alumnos/`, data, { headers });
  }

  // Eliminar alumno por su ID
  public eliminarAlumno(id:number) {
    // Verificamos si existe el tocken de sesión
    const token = this.facadeService.getSessionToken();
    let headers:HttpHeaders;
    if (token) {
      headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token});
    } else {
      headers = new HttpHeaders({'Content-Type': 'application/json'});
    }
    return this.http.delete(`${environment.url_api}/api/alumnos/?id=${id}`, { headers });
  }
}
