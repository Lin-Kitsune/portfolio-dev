import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WebpayService {

  private backendUrl = 'http://localhost:3000/createWebPayTransaction';  // URL del backend local

  constructor(private http: HttpClient) { }

  // Crear una transacción en WebPay
  createTransaction(amount: number, orderId: string): Observable<any> {
    const transactionData = {
      buy_order: orderId,       // ID único de la compra
      session_id: 'session123456', // ID de la sesión (debería ser único por transacción)
      amount: amount,           // Monto de la compra
      return_url: 'http://localhost:4200/pago-exitoso',  // URL de retorno en frontend
    };

    console.log('Datos de la transacción:', transactionData);  // Imprimir los datos que se están enviando

    return this.http.post<any>(this.backendUrl, transactionData).pipe(
      tap(response => {
        console.log('Respuesta de WebPay Backend:', response);  // Verifica la respuesta aquí
        this.createPaymentForm(response);  // Crear y enviar el formulario de pago
      })
    );
  }

  // Crear un formulario de pago y enviarlo a WebPay
  private createPaymentForm(response: any) {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = response.url; // La URL proporcionada por WebPay

    const tokenInput = document.createElement('input');
    tokenInput.type = 'hidden';
    tokenInput.name = 'token_ws'; // WebPay requiere este campo con el nombre 'token_ws'
    tokenInput.value = response.token;

    form.appendChild(tokenInput);
    document.body.appendChild(form);
    form.submit(); // Enviar el formulario automáticamente
  }

  // Confirmar la transacción en el backend después del pago
  confirmTransaction(token: string): Observable<any> {
    return this.http.post<any>('http://localhost:3000/confirmWebPayTransaction', { token });
  }
}
