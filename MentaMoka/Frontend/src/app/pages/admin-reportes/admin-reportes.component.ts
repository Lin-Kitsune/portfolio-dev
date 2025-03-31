import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../../Service/firestore.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).vfs = pdfFonts.vfs;

@Component({
  selector: 'app-admin-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-reportes.component.html',
  styleUrls: ['./admin-reportes.component.scss']
})
export class AdminReportesComponent {
  rangoSeleccionado: string = 'diario';
  modoSeleccionado: string = 'tienda';
  firestoreService = inject(FirestoreService);

  cargando: boolean = false;
  mensaje: string | null = null;
  error: boolean = false;

  async generarReporte() {
    this.cargando = true;
    this.mensaje = null;
    this.error = false;

    const ahora = new Date();
    const desde = new Date();

    if (this.rangoSeleccionado === 'diario') {
      desde.setHours(0, 0, 0, 0);
    } else {
      desde.setDate(ahora.getDate() - 6);
      desde.setHours(0, 0, 0, 0);
    }

    try {
      const pedidos = await this.firestoreService.getPedidosFiltrados(this.modoSeleccionado, desde);

      const productosMap: { [key: string]: { quantity: number; total: number; tipoEntrega: string } } = {};

      pedidos.forEach((pedido: any) => {
        pedido.products?.forEach((prod: any) => {
          const tipo = this.modoSeleccionado === 'general' ? pedido.tipoEntrega : this.modoSeleccionado;
          const key = `${prod.name}||${tipo}`;

          if (!productosMap[key]) {
            productosMap[key] = { quantity: 0, total: 0, tipoEntrega: tipo };
          }

          productosMap[key].quantity += prod.quantity;
          productosMap[key].total += prod.quantity * prod.price;
        });
      });

      const rows = Object.entries(productosMap).map(([key, data]) => {
        const [name, tipoEntrega] = key.split('||');
        return [
          { text: name, style: 'tableText' },
          { text: tipoEntrega.toUpperCase(), style: 'tableText' },
          { text: data.quantity.toString(), style: 'tableText' },
          { text: `$${data.total.toLocaleString('es-CL')}`, style: 'tableText' }
        ];
      });

      const totalGeneral = Object.values(productosMap).reduce((acc, p) => acc + p.total, 0);

      // Totales por categoría para modo general
      let totalTienda = 0;
      let totalDelivery = 0;

      if (this.modoSeleccionado === 'general') {
        Object.values(productosMap).forEach(p => {
          if (p.tipoEntrega === 'tienda') totalTienda += p.total;
          if (p.tipoEntrega === 'delivery') totalDelivery += p.total;
        });
      }

      const resumenTotales: any[] = [];

      if (this.modoSeleccionado === 'general') {
        resumenTotales.push(
          {
            text: `Total TIENDA: $${totalTienda.toLocaleString('es-CL')}`,
            style: 'totalResumen'
          },
          {
            text: `Total DELIVERY: $${totalDelivery.toLocaleString('es-CL')}`,
            style: 'totalResumen'
          }
        );
      }

      const docDefinition = {
        pageMargins: [40, 60, 40, 60],
        content: [
          { text: 'REPORTE DE VENTAS', style: 'title' },
          {
            columns: [
              { text: `Tipo de entrega: ${this.modoSeleccionado.toUpperCase()}`, style: 'subheader' },
              { text: `Rango: ${this.rangoSeleccionado.toUpperCase()}`, style: 'subheader', alignment: 'right' }
            ]
          },
          {
            text: `Fecha de generación: ${new Date().toLocaleDateString()}`,
            style: 'date',
            margin: [0, 10]
          },
          {
            table: {
              widths: ['*', 'auto', 'auto', 'auto'],
              body: [
                [
                  { text: 'Producto', style: 'tableHeader' },
                  { text: 'Categoría', style: 'tableHeader' },
                  { text: 'Cantidad Vendida', style: 'tableHeader' },
                  { text: 'Total', style: 'tableHeader' }
                ],
                ...rows
              ]
            },
            layout: 'lightHorizontalLines',
            margin: [0, 10]
          },
          ...resumenTotales,
          {
            text: `Total General: $${totalGeneral.toLocaleString('es-CL')}`,
            style: 'total'
          }
        ],
        styles: {
          title: {
            fontSize: 20,
            bold: true,
            alignment: 'center',
            margin: [0, 0, 0, 15],
            color: '#4B2E2A'
          },
          subheader: {
            fontSize: 12,
            color: '#444444',
            margin: [0, 0, 0, 5]
          },
          date: {
            fontSize: 10,
            italics: true,
            color: '#666666'
          },
          tableHeader: {
            bold: true,
            fillColor: '#F2E1C2',
            color: '#4B2E2A',
            fontSize: 11,
            alignment: 'center',
            margin: [0, 5]
          },
          tableText: {
            fontSize: 10,
            alignment: 'center'
          },
          totalResumen: {
            fontSize: 11,
            bold: true,
            alignment: 'right',
            color: '#4B2E2A',
            margin: [0, 5, 0, 0]
          },
          total: {
            fontSize: 12,
            bold: true,
            alignment: 'right',
            margin: [0, 15, 0, 0],
            color: '#4B2E2A'
          }
        }
      };

      pdfMake.createPdf(docDefinition).download(`reporte-${this.modoSeleccionado}-${this.rangoSeleccionado}.pdf`);
      this.mensaje = 'Reporte generado exitosamente.';
    } catch (error) {
      console.error('❌ Error al generar el reporte:', error);
      this.error = true;
      this.mensaje = 'Ocurrió un error al generar el PDF. Intenta nuevamente.';
    } finally {
      this.cargando = false;
    }
  }
}
