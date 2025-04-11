import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pago-exitoso',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pago-exitoso.component.html',
  styleUrls: ['./pago-exitoso.component.scss']
})
export class PagoExitosoComponent implements OnInit {
  transactionDetails: any = null;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(async params => {
      const token = params['token'];

      if (!token) {
        this.error = true;
        this.loading = false;
        return;
      }

      try {
        // 🔁 Hacemos commit real para confirmar si fue exitoso
        const response = await this.http
          .post<any>('http://localhost:3000/webpay/commit', { token })
          .toPromise();

        this.transactionDetails = {
          token,
          status: response.status,
          amount: response.amount,
          buy_order: response.buy_order,
          authorization_code: response.authorization_code,
          transaction_date: response.transaction_date,
          installments: response.installments_number,
          card_number: response.card_detail?.card_number
        };

        console.log('✅ Transacción confirmada desde backend:', this.transactionDetails);
      } catch (err) {
        console.error('❌ Error al confirmar en backend:', err);
        this.error = true;
      } finally {
        this.loading = false;

        if (this.transactionDetails?.status === 'AUTHORIZED') {
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 5000);
        }
      }
    });
  }
}
