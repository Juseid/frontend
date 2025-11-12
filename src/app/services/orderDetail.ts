import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { OrderDetailI } from '../models/orderDetail'; // Asegúrate que la ruta sea correcta
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class OrderDetailService {
  private baseUrl = 'http://localhost:4000/api/ocul/OrderDetails';
  private orderDetailsSubject = new BehaviorSubject<OrderDetailI[]>([]);
  public orderDetails$ = this.orderDetailsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const token = this.authService.getToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getAllOrderDetails(): Observable<OrderDetailI[]> {
    // Tu controlador devuelve "orderdetails" en plural
    return this.http.get<{ orderdetails: OrderDetailI[] }>(this.baseUrl, { headers: this.getHeaders() })
      .pipe(
        map(response => response.orderdetails)
      );
  }

  // Clave compuesta
  getOrderDetailById(id_order: number, id_product: number): Observable<OrderDetailI> {
    return this.http.get<{ orderDetail: OrderDetailI }>(`${this.baseUrl}/${id_order}/${id_product}`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.orderDetail)
      );
  }

  createOrderDetail(orderDetail: OrderDetailI): Observable<OrderDetailI> {
    return this.http.post<OrderDetailI>(this.baseUrl, orderDetail, { headers: this.getHeaders() });
  }

  // Clave compuesta
  updateOrderDetail(id_order: number, id_product: number, orderDetail: Partial<OrderDetailI>): Observable<OrderDetailI> {
    return this.http.patch<OrderDetailI>(`${this.baseUrl}/${id_order}/${id_product}`, orderDetail, { headers: this.getHeaders() });
  }

  // Clave compuesta
  deleteOrderDetail(id_order: number, id_product: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id_order}/${id_product}`, { headers: this.getHeaders() });
  }

  // Clave compuesta
  deleteOrderDetailLogic(id_order: number, id_product: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id_order}/${id_product}/logic`, { headers: this.getHeaders() });
  }

  updateLocalOrderDetails(orderDetails: OrderDetailI[]): void {
    this.orderDetailsSubject.next(orderDetails);
  }

  refreshOrderDetails(): void {
    this.getAllOrderDetails().subscribe(orderDetails => {
      this.orderDetailsSubject.next(orderDetails);
    });
  }
}