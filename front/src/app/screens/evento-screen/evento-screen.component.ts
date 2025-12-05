import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { FacadeService } from 'src/app/services/facade.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-evento-screen',
  templateUrl: './evento-screen.component.html',
  styleUrls: ['./evento-screen.component.scss']
})
export class EventoScreenComponent {
  // Objeto para bindear con el HTML
  public user: any = {};
  
  // Banderas para mostrar/ocultar los componentes hijos
  public isAdmin: boolean = false;
  public isAlumno: boolean = false;
  public isMaestro: boolean = false;

  constructor(
    private location : Location,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    public facadeService: FacadeService,
  ) { }

  ngOnInit(): void {
    // Si el usuario ya está logueado, pre-seleccionamos su rol
    // para que no tenga que dar clic en el radio button
    const userGroup = this.facadeService.getUserGroup();
    
    if (userGroup) {
      this.user.tipo_usuario = userGroup;
      this.actualizarVistas(userGroup);
    }
  }

  public radioChange(event: MatRadioChange) {
    this.actualizarVistas(event.value);
  }

  // Lógica central para encender/apagar banderas
  private actualizarVistas(role: string) {
    this.isAdmin = false;
    this.isAlumno = false;
    this.isMaestro = false;

    if (role === 'administrador') {
      this.isAdmin = true;
    } else if (role === 'alumno') {
      this.isAlumno = true;
    } else if (role === 'maestro') {
      this.isMaestro = true;
    }
  }

  public goBack() {
    this.location.back();
  }
}
