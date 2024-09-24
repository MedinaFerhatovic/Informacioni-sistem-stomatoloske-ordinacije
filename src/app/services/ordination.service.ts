import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { catchError, Observable, throwError } from 'rxjs';
import { Ordination } from "../models/ordination";


@Injectable() export class OrdinationService{
  private apiUrl = `${environment.apiUrl}/ordinations`;  

  constructor(private http: HttpClient) { }

  addOrdination(ordination: OrdinationDto): Observable<Ordination> {
    return this.http.post<Ordination>(this.apiUrl, ordination)
      .pipe(catchError(this.handleError));
  }

  getOrdinationById(id: number): Observable<Ordination> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Ordination>(url).pipe(
      catchError(this.handleError)
    );
  }
  

  getOrdinations(): Observable<Ordination[]> {
    return this.http.get<Ordination[]>(this.apiUrl);
  }

  getOrdinationByOwner(owner: number): Observable<Ordination> {
    return this.http.get<Ordination>(`${this.apiUrl}/owner/${owner}`);
  }

  updateOrdination(ordinationId: number, ordination: OrdinationDto): Observable<Ordination>{
    console.log('Updating ordination with ID:', ordinationId);
    return this.http.put<Ordination>(`${this.apiUrl}/${ordinationId}`, ordination).pipe(
      catchError((error) => {
        console.error('Greška pri ažuriranju:', error);
        alert('Došlo je do greške prilikom spremanja izmjena.');
        return throwError(error);
      })
    );
  }
  
  deleteOrdination(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  searchOrdinationsByLocation(latitude: number, longitude: number, radiusKm: number): Observable<Ordination[]> {
    return this.http.get<Ordination[]>(`${this.apiUrl}/search`, {
      params: {
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        radiusKm: radiusKm.toString()
      }
    }).pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('Došlo je do greške:', error);
    return throwError(error);
  }
}

export interface OrdinationDto {
  ordinationId?: number;  
  name: string;
  phoneNumber?: string;
  ownerEmail?: string;
  address: string;
}
