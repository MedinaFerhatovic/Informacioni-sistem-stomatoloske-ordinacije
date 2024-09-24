import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation';
import { environment } from '../environments/environment';

@Injectable() export class ReservationService {
    
  private apiUrl = `${environment.apiUrl}/reservations`

  constructor(private http: HttpClient) {}

  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl);
  }

  updateReservationStatus(reservationId: number, newStatus: string): Observable<any> {
    const url = `${this.apiUrl}/${reservationId}/status`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.put(url, JSON.stringify(newStatus), { headers: headers });
  }

  getReservationsByOrdination(ordinationId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/ordination/${ordinationId}`);
  }

  
  
}
