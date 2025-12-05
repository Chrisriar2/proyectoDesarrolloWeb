import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ValidatorService } from './tools/validator.service';
import { ErrorsService } from './tools/errors.service';
import { FacadeService } from './facade.service'; // Asegúrate que la ruta sea correcta
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService
  ) { }

  // 1. AJUSTE DE ESQUEMA: Nombres igual a Django (models.py)
  public esquemaEvento() {
    return {
      'titulo': '',
      'descripcion': '',
      'fecha_inicio': '',
      'fecha_fin': '',
      'ubicacion': '',
      'cupo_maximo': 30,
      'tipo': 'CONFERENCIA',
      // Si tienes campos extra que no están en Django, ignóralos por ahora
    }
  }

  // 2. VALIDACIÓN (Ajustada a los campos en español)
  public validarEvento(data: any, editar: boolean) {
    let error: any = {};

    if (!this.validatorService.required(data["titulo"])) {
      error['titulo'] = this.errorService.required;
    }

    if (!this.validatorService.required(data["fecha_inicio"])) {
      error['fecha_inicio'] = this.errorService.required;
    }

    if (!this.validatorService.required(data["ubicacion"])) {
      error['ubicacion'] = this.errorService.required;
    }

    if (!this.validatorService.required(data["cupo_maximo"])) {
      error['cupo_maximo'] = this.errorService.required;
    } else if (!this.validatorService.numeric(data["cupo_maximo"])) {
      error['cupo_maximo'] = "Debe ser numérico";
    }

    return error;
  }

  // PETICIONES HTTP (desde la REST API) para EVENTOS
  // Obtener headers con Token (Reutilizable)
  private getHeaders(): HttpHeaders {
    const token = this.facadeService.getSessionToken();
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
        headers = headers.append('Authorization', 'Bearer ' + token);
    }
    return headers;
  }

  // LISTAR: Apunta a /api/eventos-all/
  public obtenerEventos(): Observable<any> {
    return this.http.get<any>(`${environment.url_api}/api/eventos-all/`, { headers: this.getHeaders() });
  }

  // OBTENER UNO: Apunta a /api/evento/?id=X
  public obtenerEventoPorId(id: number): Observable<any> {
    return this.http.get<any>(`${environment.url_api}/api/evento/?id=${id}`, { headers: this.getHeaders() });
  }

  // CREAR: Apunta a /api/evento/ (POST)
  public registrarEvento(data: any): Observable<any> {
    return this.http.post<any>(`${environment.url_api}/api/evento/`, data, { headers: this.getHeaders() });
  }

  // ACTUALIZAR: Apunta a /api/evento/ (PUT)
  public actualizarEvento(data: any): Observable<any> {
    return this.http.put<any>(`${environment.url_api}/api/evento/`, data, { headers: this.getHeaders() });
  }

  // ELIMINAR: Apunta a /api/evento/?id=X (DELETE)
  public eliminarEvento(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.url_api}/api/evento/?id=${id}`, { headers: this.getHeaders() });
  }

  //INSCRIPCIONES

  // 1. Obtener la lista de IDs de los eventos a los que ya estoy inscrito
  public obtenerMisInscripciones(): Observable<any> {
    return this.http.get<any>(`${environment.url_api}/mis-inscripciones/`, { headers: this.getHeaders() });
  }

  // 2. Inscribirse a un evento
  public inscribirseEvento(evento_id: number): Observable<any> {
    return this.http.post<any>(`${environment.url_api}/inscribirse/`, { evento_id: evento_id }, { headers: this.getHeaders() });
  }

  // 3. Darse de baja (Opcional, pero recomendado)
  public desinscribirseEvento(evento_id: number): Observable<any> {
    return this.http.delete<any>(`${environment.url_api}/inscribirse/?evento_id=${evento_id}`, { headers: this.getHeaders() });
  }

}