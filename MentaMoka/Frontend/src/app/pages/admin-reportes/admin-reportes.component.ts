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
  rangoSeleccionado: string = 'diario'; // 'diario' o 'semanal'
  modoSeleccionado: string = 'tienda';  // 'tienda' o 'delivery'
  firestoreService = inject(FirestoreService);

  async generarReporte() {
    console.log('🔍 Generando reporte con:', this.rangoSeleccionado, this.modoSeleccionado);

    const ahora = new Date();
    const desde = new Date();

    if (this.rangoSeleccionado === 'diario') {
      desde.setHours(0, 0, 0, 0);
    } else {
      desde.setDate(ahora.getDate() - 6);
      desde.setHours(0, 0, 0, 0);
    }

    try {
      const pedidos: any[] = await this.firestoreService.getPedidosFiltrados(this.modoSeleccionado, desde);
      console.log('📦 Pedidos encontrados:', pedidos.length);

      const productosMap: { [key: string]: { quantity: number; total: number } } = {};

      pedidos.forEach((pedido: any) => {
        pedido.products?.forEach((prod: any) => {
          if (!productosMap[prod.name]) {
            productosMap[prod.name] = { quantity: 0, total: 0 };
          }
          productosMap[prod.name].quantity += prod.quantity;
          productosMap[prod.name].total += prod.quantity * prod.price;
        });
      });

      const rows = Object.entries(productosMap).map(([name, data]) => [
        name,
        data.quantity,
        `$${data.total.toLocaleString('es-CL')}`
      ]);

      const totalGeneral = Object.values(productosMap).reduce((acc, p) => acc + p.total, 0);

      const docDefinition = {
        content: [
          { text: `📄 Reporte ${this.rangoSeleccionado.toUpperCase()} - ${this.modoSeleccionado.toUpperCase()}`, style: 'header' },
          { text: 'Fecha de generación: ' + new Date().toLocaleDateString(), margin: [0, 10] },
          {
            table: {
              widths: ['*', '*', '*'],
              body: [
                ['Producto', 'Cantidad Vendida', 'Total'],
                ...rows
              ]
            }
          },
          { text: `\nTotal general: $${totalGeneral.toLocaleString('es-CL')}`, style: 'total' }
        ],
        styles: {
          header: { fontSize: 22, bold: true, color: '#A67B5B' },
          total: { fontSize: 16, bold: true, alignment: 'right', margin: [0, 10] }
        }
      };

      console.log('✅ Generando PDF...');
      pdfMake.createPdf(docDefinition).download(`reporte-${this.modoSeleccionado}-${this.rangoSeleccionado}.pdf`);

    } catch (error) {
      console.error('❌ Error al generar el reporte:', error);
    }
  }
}
