import { Component, inject,  CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import dayjs from 'dayjs';
import { firstValueFrom } from 'rxjs';
import { NgApexchartsModule } from "ng-apexcharts";
import {
    Chart,
    ChartOptions,
    ChartData,
    Plugin,
    ChartTypeRegistry,
    TooltipItem
  } from 'chart.js';
  
import weekOfYear from 'dayjs/plugin/weekOfYear';

import { FirestoreService } from '../../../Service/firestore.service';
import { OrderService } from '../../../Service/order.service';
import { ReservasService } from '../../../Service/reservas.service';
import { ProductService } from '../../../Service/product.service';


Chart.register({
    id: 'centerText',
    beforeDraw(chart) {
        const { width, height, ctx } = chart;
        const data = chart.config.data;
        const dataset = data.datasets?.[0];
      
        if (!dataset || !Array.isArray(dataset.data)) return;
      
        const activeElements = chart.getActiveElements();
        let label = 'Total';
        let value = dataset.data.reduce((acc: number, val) =>
          acc + (typeof val === 'number' ? val : 0), 0
        );
        let color = '#1f2937'; // gris oscuro predeterminado
      
        if (activeElements.length > 0) {
          const index = activeElements[0].index;
          label = data.labels?.[index] as string;
          const val = dataset.data[index];
          value = typeof val === 'number' ? val : 0;
      
          const bg = dataset.backgroundColor;
          if (Array.isArray(bg)) {
            const selectedColor = bg[index];
            color = typeof selectedColor === 'string' ? selectedColor : color;
          }
        }
      
        ctx.save();
        ctx.clearRect(0, 0, width, height);
        ctx.font = 'bold 16px sans-serif';
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.fillText(label, width / 2, height / 2 - 10);
        ctx.font = '14px sans-serif';
        ctx.fillText(`${value} productos`, width / 2, height / 2 + 10);
        ctx.restore();
      }          
  });
   
  dayjs.extend(weekOfYear);

@Component({
  selector: 'app-management-graphics',
  standalone: true,
  imports: [CommonModule, RouterModule, NgChartsModule, NgApexchartsModule],
  templateUrl: './management-graphics.component.html',
  styleUrls: ['./management.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class ManagementGraphicsComponent {
  firestoreService = inject(FirestoreService);
  orderService = inject(OrderService);
  reservasService = inject(ReservasService);
  productService = inject(ProductService);

  // Indicadores rápidos
 totalGastadoSemana: number = 0;
 reservasCompletadas: number = 0;
 reservasCanceladas: number = 0;
 clientesNuevos: number = 0;

 // Propiedades de valores anteriores para comparar
 previousTotalGastadoSemana: number = 0; 
 previousReservasCompletadas: number = 0;
 previousClientesNuevos: number = 0;

  // Productos top y bajos (ranking)
  productosTop: any[] = [];
  productosBajos: any[] = [];
  productosTotales: { [name: string]: number } = {}; // mapa con nombre → cantidad

  //Más vendidos:
  productosMasVendidos: { name: string; quantity: number; image_url: string; }[] = [];
  productosMenosVendidos: { name: string; quantity: number; image_url: string; }[] = [];

  // Gráficos
  ventasChartLabels: string[] = [];
  ventasChartData: ChartData<'bar'> = { labels: [], datasets: [] };

  categoriasChartLabels: string[] = [];
  categoriasChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };
  totalCategorias = 0;

  destacadosChartLabels: string[] = [];
  destacadosChartData: ChartData<'bar'> = { labels: [], datasets: [] };


  clientesTop: {
    name: string;
    lastName: string;
    total: number;
    email?: string;
    image_url?: string;
  }[] = [];

    usuariosActivos: number = 0;
    promedioDiario: number = 0;
    promedioSemanal: number = 0;
    promedioMensual: number = 0;
    
  ordenesRecientes: { id: string; total: number; tipoEntrega: string; createdAt: string }[] = [];

  public chartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Tiempo'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Usuarios Activos'
        }
      }
    },
  };
  
  public chartData: ChartData<'line'> = {
    labels: ['Diario', 'Semanal', 'Mensual'],
    datasets: [{
      label: 'Usuarios Activos', 
      data: [this.promedioDiario, this.promedioSemanal, this.promedioMensual],
      borderColor: 'rgba(75,192,192,1)',
      fill: false,
    }]
  };  
  
  ngOnInit() {
    this.cargarDatos();
  }

  async cargarDatos() {
    const pedidos = await this.firestoreService.getAllPedidos();
    const usuarios = await firstValueFrom(this.firestoreService.getUsers());
    const reservas: any[] = await firstValueFrom(this.firestoreService.getAllReservas());
  
    const productosTotales: Record<string, number> = {};
    const destacados: Record<string, number> = {};
    const categorias: Record<string, number> = {};
    const gastosPorUsuario: Record<string, number> = {};
    const ventasPorDia: Record<string, number> = {};
  
    const hoy = dayjs();
    const hace7Dias = hoy.subtract(6, 'day');

    const productosDb = await firstValueFrom(this.firestoreService.getProducts());
    const productosMap = new Map<string, any>();
    for (const prod of productosDb) {
    productosMap.set(prod.id, prod);
    }

    for (const pedido of pedidos) {
        const fecha = dayjs(pedido.createdAt?.toDate?.() ?? pedido.createdAt);
        const fechaStr = fecha.format('DD/MM');
      
        if (fecha.isAfter(hace7Dias.subtract(1, 'day'))) {
          ventasPorDia[fechaStr] = (ventasPorDia[fechaStr] || 0) + pedido.total;
          this.totalGastadoSemana += pedido.total || 0;
        }
      
        if (pedido.userId) {
          gastosPorUsuario[pedido.userId] = (gastosPorUsuario[pedido.userId] || 0) + pedido.total;
        }
      
        for (const p of pedido.products || []) {
          productosTotales[p.name] = (productosTotales[p.name] || 0) + p.quantity;
          if (p.destacado) destacados[p.name] = (destacados[p.name] || 0) + p.quantity;
      
          // 🔍 Buscamos la categoría desde productos completos
          const productoCompleto = productosMap.get(p.productId);
          const categoria = productoCompleto?.category || 'Sin categoría';
          categorias[categoria] = (categorias[categoria] || 0) + p.quantity;
        }
      }
     // Actualiza los valores anteriores antes de cambiar los actuales
    const previousTotalGastadoSemana = this.previousTotalGastadoSemana;
    const previousReservasCompletadas = this.previousReservasCompletadas;
    const previousClientesNuevos = this.previousClientesNuevos;

     // Actualizar los valores actuales
    this.totalGastadoSemana = this.totalGastadoSemana;
    this.reservasCompletadas = reservas.filter((r: any) => r.status === 'confirmada').length;
    this.reservasCanceladas = reservas.filter((r: any) => r.status === 'cancelada').length;
      
    // Ranking de productos
    this.productService.getProducts().subscribe((productos: any[]) => {
        this.productosTop = productos;
      
        const ordenados = Object.entries(productosTotales) 
          .map(([name, quantity]) => {
            const prodOriginal = this.productosTop.find((p: any) => p.name === name);
            return {
              name,
              quantity,
              image_url: prodOriginal?.image_url || 'assets/img/default-product.png'
            };
          })
          .sort((a, b) => b.quantity - a.quantity);
      
        this.productosMasVendidos = ordenados.slice(0, 5);
        this.productosMenosVendidos = ordenados.slice(-5);
    });      
  
    // Ranking de clientes
    this.clientesTop = usuarios
    .map((u: any) => {
      const [firstName, ...rest] = (u.name || '').split(' ');
      const lastName = rest.join(' ');
      return {
        name: firstName,
        lastName: lastName,
        total: gastosPorUsuario[u.uid] || 0
      };
    })
    .filter(c => c.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);  
  
    // Órdenes recientes
    this.ordenesRecientes = pedidos
      .sort((a: any, b: any) => {
        const dateA = dayjs(a.createdAt?.toDate?.() ?? a.createdAt);
        const dateB = dayjs(b.createdAt?.toDate?.() ?? b.createdAt);
        return dateB.valueOf() - dateA.valueOf();
      })
      .slice(0, 5)
      .map((p: any) => ({
        id: p.id,
        total: p.total,
        tipoEntrega: p.tipoEntrega,
        createdAt: dayjs(p.createdAt?.toDate?.() ?? p.createdAt).format('DD/MM/YYYY HH:mm')
      }));
  
    // Gráficos
    this.ventasChartLabels = Object.keys(ventasPorDia);
    this.ventasChartData = {
      labels: this.ventasChartLabels,
      datasets: [{
        label: 'Ingresos CLP',
        data: Object.values(ventasPorDia),
        backgroundColor: '#A3B899'
      }]
    };
  
    this.categoriasChartLabels = Object.keys(categorias);
    this.categoriasChartData = {
      labels: this.categoriasChartLabels,
      datasets: [{
        data: Object.values(categorias),
        backgroundColor: ['#A67B5B', '#D6A679', '#F2E1C2', '#A3B899', '#B6855D']
      }]
    };  
    // console.log('Categorías Chart Data:', this.categoriasChartData);
  
    this.destacadosChartLabels = Object.keys(destacados);
    this.destacadosChartData = {
      labels: this.destacadosChartLabels,
      datasets: [{
        label: 'Vendidos',
        data: Object.values(destacados),
        backgroundColor: '#D6A679'
      }]
    };
  
    // Reservas
    this.reservasCompletadas = reservas.filter((r: any) => r.status === 'confirmada').length;
    this.reservasCanceladas = reservas.filter((r: any) => r.status === 'cancelada').length;
  
    // Clientes nuevos este mes
    const inicioMes = dayjs().startOf('month');
    this.clientesNuevos = usuarios.filter((u: any) => {
      const fechaCreacion = typeof u.createdAt?.toDate === 'function' ? u.createdAt.toDate() : u.createdAt;
      return dayjs(fechaCreacion).isAfter(inicioMes);
    }).length;

    this.totalCategorias = Object.values(categorias).reduce((sum, val) => sum + val, 0);

    // Calcular el porcentaje de cambio entre el valor anterior y el actual
    const gastoPorcentaje = this.calculatePercentage(this.totalGastadoSemana, previousTotalGastadoSemana);
    const reservasPorcentaje = this.calculatePercentage(this.reservasCompletadas, previousReservasCompletadas);
    const clientesPorcentaje = this.calculatePercentage(this.clientesNuevos, previousClientesNuevos);

    // Asignar a la plantilla o variables
    this.previousTotalGastadoSemana = this.totalGastadoSemana;
    this.previousReservasCompletadas = this.reservasCompletadas;
    this.previousClientesNuevos = this.clientesNuevos;

    // Usuarios activos (últimos 10 minutos)
    const ahora = dayjs();
    const hace10Min = ahora.subtract(10, 'minute');

    const usuariosActivosSet = new Set<string>();
    const visitasPorDia: Record<string, number> = {};
    const visitasPorSemana: Record<string, number> = {};
    const visitasPorMes: Record<string, number> = {};

    for (const pedido of pedidos) {
    const fecha = dayjs(pedido.createdAt?.toDate?.() ?? pedido.createdAt);
    const userId = pedido.userId;

    if (!userId) continue;

    // Visitas diarias
    const dia = fecha.format('YYYY-MM-DD');
    visitasPorDia[dia] = (visitasPorDia[dia] || 0) + 1;

    // Visitas semanales (por semana del año)
    const semana = fecha.week();
    visitasPorSemana[semana] = (visitasPorSemana[semana] || 0) + 1;

    // Visitas mensuales
    const mes = fecha.format('YYYY-MM');
    visitasPorMes[mes] = (visitasPorMes[mes] || 0) + 1;

    if (fecha.isAfter(hace10Min)) {
        usuariosActivosSet.add(userId);
    }
    }

    this.usuariosActivos = usuariosActivosSet.size;
    this.promedioDiario = Math.round(Object.values(visitasPorDia).reduce((a, b) => a + b, 0) / Object.keys(visitasPorDia).length);
    this.promedioSemanal = Math.round(Object.values(visitasPorSemana).reduce((a, b) => a + b, 0) / Object.keys(visitasPorSemana).length);
    this.promedioMensual = Math.round(Object.values(visitasPorMes).reduce((a, b) => a + b, 0) / Object.keys(visitasPorMes).length);

  }

  getCategoriaColor(i: number): string {
    const colores = this.categoriasChartData?.datasets?.[0]?.backgroundColor;
    return Array.isArray(colores) ? (colores[i] as string ?? '#ccc') : '#ccc';
  }

  getPorcentajeCategoria(i: number): string {
    const data = this.categoriasChartData.datasets[0]?.data || [];
    const total = data.reduce((acc, val) => acc + Number(val), 0);
    if (total === 0) return '0';
    return ((Number(data[i]) / total) * 100).toFixed(1);
  }
  
  getTotalCategorias(): number {
    return this.categoriasChartData.datasets[0]?.data?.reduce((a, b) => a + b, 0) || 0;
  }
  
  getCategoriaPorcentaje(i: number): string {
    const data = this.categoriasChartData.datasets[0].data as number[];
    const total = data.reduce((sum, val) => sum + val, 0);
    return ((data[i] / total) * 100).toFixed(0);
  }

  calculatePercentage(currentValue: number, previousValue: number): string {
    if (previousValue === 0) return '100%'; // Si el valor anterior es 0, consideramos un 100% de cambio
    const change = ((currentValue - previousValue) / previousValue) * 100;
    return change.toFixed(2) + '%';
  }
  
  categoriasChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    cutout: '70%',
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'doughnut'>) => {
            const label = context.label || '';
            const value = context.raw as number;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(0);
            return `${label}: ${percentage}% (${value} productos)`;
          }
        },
      },
      legend: {
        display: false
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true
    },
    hover: {
      mode: 'nearest',
      intersect: true
    }
  };

}
