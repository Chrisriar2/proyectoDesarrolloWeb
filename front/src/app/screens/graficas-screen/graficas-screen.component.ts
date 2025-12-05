import { Component, OnInit } from '@angular/core';
import { AdministradoresService } from 'src/app/services/administradores.service'; // Ajusta tu ruta
import { ChartOptions, ChartType, ChartData } from 'chart.js'; // Asegúrate de tener chart.js instalado

@Component({
  selector: 'app-graficas-screen',
  templateUrl: './graficas-screen.component.html',
  styleUrls: ['./graficas-screen.component.scss']
})
export class GraficasScreenComponent implements OnInit {

  // --- VARIABLES PARA GRÁFICA DE BARRAS (Total Usuarios) ---
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: string[] = ['Administradores', 'Maestros', 'Alumnos'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartData<'bar'> = {
    labels: this.barChartLabels,
    datasets: [
      { data: [0, 0, 0], label: 'Usuarios Registrados', backgroundColor: ['#FF5733', '#33FF57', '#3357FF'] }
    ]
  };

  // --- VARIABLES PARA GRÁFICA DE DONA (Porcentajes) ---
  public doughnutChartLabels: string[] = ['Administradores', 'Maestros', 'Alumnos'];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      { data: [0, 0, 0], backgroundColor: ['#FF5733', '#33FF57', '#3357FF'] }
    ]
  };
  public doughnutChartType: ChartType = 'doughnut';

  // --- VARIABLES PARA GRÁFICA DE PIE (Circular) ---
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: string[] = ['Administradores', 'Maestros', 'Alumnos'];
  public pieChartData: ChartData<'pie'> = {
    labels: this.pieChartLabels,
    datasets: [
      { data: [0, 0, 0], backgroundColor: ['#FF5733', '#33FF57', '#3357FF'] }
    ]
  };
  public pieChartType: ChartType = 'pie';

  constructor(
    private adminService: AdministradoresService
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  public cargarDatos() {
    this.adminService.obtenerTotalUsuarios().subscribe(
      (response) => {
        console.log("Datos gráficas:", response);
        // Extraemos los contadores del JSON de Django
        const admins = response.admins;
        const maestros = response.maestros;
        const alumnos = response.alumnos;

        // Actualizamos dinámicamente los arrays 'data'
        this.actualizarGraficas([admins, maestros, alumnos]);
      },
      (error) => {
        console.error("Error al cargar estadísticas:", error);
      }
    );
  }

  public actualizarGraficas(datos: number[]) {
    // 1. Barras
    this.barChartData = {
      labels: this.barChartLabels,
      datasets: [
        { data: datos, label: 'Total de Usuarios', backgroundColor: ['#dc3545', '#ffc107', '#0d6efd'] }
      ]
    };

    // 2. Dona
    this.doughnutChartData = {
      labels: this.doughnutChartLabels,
      datasets: [
        { data: datos, backgroundColor: ['#dc3545', '#ffc107', '#0d6efd'] }
      ]
    };

    // 3. Pie
    this.pieChartData = {
      labels: this.pieChartLabels,
      datasets: [
        { data: datos, backgroundColor: ['#dc3545', '#ffc107', '#0d6efd'] }
      ]
    };
  }
}