import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { DentalRecord } from '../models/dentalRecord';

@Injectable() export class DentalRecordService {

    private apiUrl = `${environment.apiUrl}/dentalRecord` 

  constructor(private http: HttpClient) { }

  createDentalRecord(dentalRecordDto: DentalRecordDto): Observable<DentalRecord> {
    return this.http.post<DentalRecord>(this.apiUrl, dentalRecordDto);
  }

  getAllDentalRecords(): Observable<DentalRecord[]> {
    return this.http.get<DentalRecord[]>(this.apiUrl);
  }

  getDentalRecordById(id: number): Observable<DentalRecord> {
    return this.http.get<DentalRecord>(`${this.apiUrl}/${id}`);
  }

  deleteDentalRecord(id:number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateDentalRecord(id: number, record: DentalRecordDto): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, record);
  }

  addVisit(dentalRecordId: number, visitDto: VisitDto): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${dentalRecordId}/add-visit`, visitDto);
  }

  getVisitsByDentalRecordId(dentalRecordId: number): Observable<VisitDto[]> {
    return this.http.get<VisitDto[]>(`${this.apiUrl}/visits/${dentalRecordId}`);
  }

  getDentalRecordsByOrdination(ordinationId: number): Observable<DentalRecord[]> {
    return this.http.get<DentalRecord[]>(`${this.apiUrl}/ordination/${ordinationId}`);
  }
  
}

export class DentalRecordDto {
    patientEmail?: string; 
    patientFirstName?: string; 
    patientLastName?: string; 
    visitDate?: string; 
    examination?: string; 
    recipe?: string;
    addition?: string; 
    ordinationId?: number; 
    ordinationName?: string;
    ordinationPhone?: string;
    ordinationAddress?: string;
    dentalRecordId?: number;
}

export interface VisitDto {
  visitId: number;
  dentalRecordId: number;
  visitDate: string;
  examination: string;
  recipe: string;
  addition: string;
}

