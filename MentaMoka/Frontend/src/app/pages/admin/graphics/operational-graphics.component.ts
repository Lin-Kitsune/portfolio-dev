import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../Service/order.service';
import { ReservasService } from '../../../Service/reservas.service';
import { ProductService } from '../../../Service/product.service';
import { FirestoreService } from '../../../Service/firestore.service';
import { ChartOptions, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import dayjs from 'dayjs';

@Component({
  selector: 'app-operational-graphics',
  standalone: true,
   imports: [ CommonModule, NgChartsModule, ],
  templateUrl: './operational-graphics.component.html',
  styleUrls: ['./operational-graphics.component.scss']
})

export class OperationalGraphicsComponent implements OnInit {

    pedidosEnPreparacion = 0;
    pedidosListos = 0;
    pedidosDemorados = 0;
    reservasHoy = 0;
    productosStockBajo = 0;

    pedidosEntregadosHoy = 0;
    ingresosHoy = 0;
    tiempoPromedio = 0;
    trabajadoresEnTurno = 0;
    reservasFuturas = 0;

    pedidosAyer = 0;
    ingresosAyer = 0;
    tiempoPromedioAyer = 0;
    pedidosHoy: number = 0;

    deltaIngresos = 0;
    deltaPedidos = 0;
    deltaTiempo = 0;

    hayCriticos = false;

    topProductosHoy: [string, number][] = [];
  
    tipoEntregaLabels: string[] = ['Tienda', 'Delivery', 'Mesa'];
    tipoEntregaData = {
        labels: this.tipoEntregaLabels,
        datasets: [
          {
            data: [0, 0, 0],
            backgroundColor: ['#A67B5B', '#D6A679', '#A3B899'], // opcional: colores pastel LinMaD
          },
        ],
      };
    tipoEntregaChartType: ChartType = 'pie';
    tipoEntregaOptions: ChartOptions = {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' }
      }
    };
  
    turnosHoy: any[] = [];
    objetivoDiario = 20000;
  
    constructor(
      private orderService: OrderService,
      private reservasService: ReservasService,
      private productService: ProductService,
      private firestoreService: FirestoreService
    ) {}
  
    ngOnInit(): void {
      this.cargarPedidos();
      this.cargarReservas();
      this.cargarStock();
      this.cargarTurnos();
      this.hayCriticos = this.pedidosDemorados > 3 || this.productosStockBajo > 0 || this.trabajadoresEnTurno === 0;
    }

    get mostrarAlerta(): boolean {
        return this.pedidosDemorados > 3 || this.productosStockBajo > 0 || this.trabajadoresEnTurno === 0;
      }
      
    calcularDiferencia(hoy: number, ayer: number, unidad: string = '%'): string {
        if (ayer === 0) return '+0%';
        const diff = Math.round(((hoy - ayer) / ayer) * 100);
        const simbolo = diff >= 0 ? '▲' : '▼';
        return `${simbolo} ${Math.abs(diff)}${unidad === '%' ? '%' : ` ${unidad}`} respecto a ayer`;
    }
      
    getComparativaClass(valor: number): string {
        return valor >= 0 ? 'text-green-600 font-bold' : 'text-red-500 font-bold';
    }   
  
    cargarPedidos() {
      const ahora = dayjs();
      this.orderService.obtenerPedidosTiempoReal().subscribe((orders: any[]) => {
        this.pedidosEnPreparacion = orders.filter(o => o.status === 'en preparacion').length;
        this.pedidosListos = orders.filter(o => o.status === 'listo').length;
        this.pedidosDemorados = orders.filter(o => {
          const creado = dayjs(o.createdAt?.seconds * 1000);
          return o.status === 'en preparacion' && ahora.diff(creado, 'minute') > 20;
        }).length;
  
        const tipoEntregaMap = { tienda: 0, delivery: 0, mesa: 0 };
        orders.forEach(o => {
          if (o.tipoEntrega && ['tienda', 'delivery', 'mesa'].includes(o.tipoEntrega)) {
            tipoEntregaMap[o.tipoEntrega as keyof typeof tipoEntregaMap]++;
          }
        });
  
        this.tipoEntregaData = {
            labels: this.tipoEntregaLabels,
            datasets: [
              {
                data: [
                  tipoEntregaMap['tienda'],
                  tipoEntregaMap['delivery'],
                  tipoEntregaMap['mesa']
                ],
                backgroundColor: ['#A67B5B', '#D6A679', '#A3B899'], // opcional
              },
            ],
          };
          this.pedidosEntregadosHoy = orders.filter(o =>
            o.status === 'entregado' &&
            dayjs(o.createdAt?.seconds * 1000).isSame(dayjs(), 'day')
          ).length;
          
          this.ingresosHoy = orders
            .filter(o =>
              o.status === 'entregado' &&
              dayjs(o.createdAt?.seconds * 1000).isSame(dayjs(), 'day')
            )
            .reduce((total, o) => total + (o.total || 0), 0);
          
          const tiempos = orders
            .filter(o => o.status === 'listo' && o.createdAt && o.listoAt)
            .map(o => dayjs(o.listoAt?.seconds * 1000).diff(dayjs(o.createdAt?.seconds * 1000), 'minute'));
          this.tiempoPromedio = tiempos.length ? Math.round(tiempos.reduce((a, b) => a + b, 0) / tiempos.length) : 0;
          
          const productosContador: Record<string, number> = {};
          orders
            .filter(o => dayjs(o.createdAt?.seconds * 1000).isSame(dayjs(), 'day'))
            .forEach(o => {
              o.products?.forEach((p: any) => {
                productosContador[p.name] = (productosContador[p.name] || 0) + (p.quantity || 1);
              });
            });
          this.topProductosHoy = Object.entries(productosContador).sort((a, b) => b[1] - a[1]).slice(0, 3);
          
          const ayer = dayjs().subtract(1, 'day');

        const pedidosAyer = orders.filter(o =>
        o.status === 'entregado' &&
        dayjs(o.createdAt?.seconds * 1000).isSame(ayer, 'day')
        );
        const ingresosAyer = pedidosAyer.reduce((total, o) => total + (o.total || 0), 0);
        const tiemposAyer = pedidosAyer
        .filter(o => o.listoAt && o.createdAt)
        .map(o => dayjs(o.listoAt?.seconds * 1000).diff(dayjs(o.createdAt?.seconds * 1000), 'minute'));

        const promedioTiempoAyer = tiemposAyer.length
        ? Math.round(tiemposAyer.reduce((a, b) => a + b, 0) / tiemposAyer.length)
        : 0;

        //Cálculo de deltas en %
        this.deltaIngresos = ingresosAyer ? Math.round(((this.ingresosHoy - ingresosAyer) / ingresosAyer) * 100) : 0;
        this.deltaPedidos = pedidosAyer.length ? Math.round(((this.pedidosEntregadosHoy - pedidosAyer.length) / pedidosAyer.length) * 100) : 0;
        this.deltaTiempo = promedioTiempoAyer ? Math.round(((this.tiempoPromedio - promedioTiempoAyer) / promedioTiempoAyer) * 100) : 0;

      });
    }
  
    cargarReservas() {
      const hoy = dayjs().format('YYYY-MM-DD');
      this.firestoreService.getAllReservas().subscribe((reservas: any[]) => {
        this.reservasHoy = reservas.filter(r => r.date === hoy).length;
        this.reservasFuturas = reservas.filter(r =>
            dayjs(r.date).isAfter(dayjs(), 'day')
          ).length;          
      });
    }
  
    cargarStock() {
      this.productService.getProducts().subscribe((productos: any[]) => {
        this.productosStockBajo = productos.filter(p => p.stock < 10).length;
      });
    }
  
    cargarTurnos() {
      const hoy = dayjs().format('YYYY-MM-DD');
      this.firestoreService.getWorkers().subscribe((trabajadores: any[]) => {
        const turnosDeHoy: any[] = [];
  
        trabajadores.forEach(trabajador => {
          if (Array.isArray(trabajador.turnos)) {
            const encontrados = trabajador.turnos
                .filter((t: any) => t.date === hoy)
                .map((t: any) => ({
                    name: trabajador.name,
                    role: trabajador.role,
                    start_time: t.start,
                    end_time: t.end
                  }));                  
            turnosDeHoy.push(...encontrados);
          }
        });
  
        this.turnosHoy = turnosDeHoy;
        this.trabajadoresEnTurno = turnosDeHoy.filter((turno: any) => {
            const ahora = dayjs();
            const start = dayjs(turno.start_time, 'HH:mm');
            const end = dayjs(turno.end_time, 'HH:mm');
            return ahora.isAfter(start) && ahora.isBefore(end);
          }).length;          
      });
    }

    getPorcentajeObjetivo(): number {
        if (!this.ingresosHoy || !this.objetivoDiario) return 0;
        const porcentaje = (this.ingresosHoy / this.objetivoDiario) * 100;
        return Math.min(100, Math.round(porcentaje));
      }
  }