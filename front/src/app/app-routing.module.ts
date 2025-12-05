import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { LoginScreenComponent } from './screens/login-screen/login-screen.component';
import { RegistroUsuariosScreenComponent } from './screens/registro-usuarios-screen/registro-usuarios-screen.component';
import { HomeScreenComponent } from './screens/home-screen/home-screen.component';
import { AdminScreenComponent } from './screens/admin-screen/admin-screen.component';
import { AlumnoScreenComponent } from './screens/alumno-screen/alumno-screen.component';
import { MaestrosScreenComponent } from './screens/maestro-screen/maestro-screen.component';
import { EventoScreenComponent } from './screens/evento-screen/evento-screen.component';
// 1. IMPORTAR EL COMPONENTE DE GRÁFICAS
import { GraficasScreenComponent } from './screens/graficas-screen/graficas-screen.component';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginScreenComponent },
      { path: 'registro-usuarios', component: RegistroUsuariosScreenComponent },
      { path: 'registro-usuarios/:rol/:id', component: RegistroUsuariosScreenComponent },
    ]
  },
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: 'home', component: HomeScreenComponent },
      { path: 'administrador', component: AdminScreenComponent },
      { path: 'alumnos', component: AlumnoScreenComponent },
      { path: 'maestros', component: MaestrosScreenComponent },
      { path: 'eventos', component: EventoScreenComponent },
      
      // 2. AGREGAR ESTA LÍNEA (Dentro del Dashboard)
      { path: 'graficas', component: GraficasScreenComponent }, 
    ]
  },
  // fallback route
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }