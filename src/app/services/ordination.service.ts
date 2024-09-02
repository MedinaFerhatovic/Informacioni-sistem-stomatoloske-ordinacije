import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { catchError, Observable, throwError } from 'rxjs';


@Injectable() export class OrdinationService{
  private apiUrl = environment.apiUrl;  // Postavi ispravnu URL putanju

  constructor(private http: HttpClient) { }

  // Metoda za dodavanje nove ordinacije
  addOrdination(ordination: OrdinationDto): Observable<Ordination> {
    return this.http.post<Ordination>(`${this.apiUrl}/ordinations`, ordination);
  }

  // Metoda za dobijanje ordinacija po ID-u
  getOrdinationById(id: number): Observable<Ordination> {
    return this.http.get<Ordination>(`${this.apiUrl}/${id}`);
  }

  getOrdinations(): Observable<Ordination[]> {
    return this.http.get<Ordination[]>(`${this.apiUrl}/ordinations`);
  }

  // Metoda za ažuriranje ordinacije
  updateOrdination(id: number, ordination: OrdinationDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, ordination);
  }

  // Metoda za brisanje ordinacije
  deleteOrdination(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

export interface Ordination {
  ordinationID: number;
  name: string;
  phoneNumber: string;
  locationID: number;
  owner: number;
  address: string;
}

export interface OrdinationDto {
  name: string;
  phoneNumber: string;
  ownerEmail: string;
  address: string;
}
