import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pago-exitoso',
  templateUrl: './pago-exitoso.component.html',
  styleUrls: ['./pago-exitoso.component.scss']
})
export class PagoExitosoComponent implements OnInit {
  transactionDetails: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Obtener parámetros de la URL que WebPay pasa (por ejemplo, estado, monto, etc.)
    this.route.queryParams.subscribe(params => {
      this.transactionDetails = params;
      console.log('Detalles de la transacción: ', this.transactionDetails);
    });
  }
}
