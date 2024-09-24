import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Appointment } from '../models/appointment';

export interface TimeSlot {
  startTime: string;  
  endTime: string;    
}

export interface DateWithSlots {
  date: string;  
  timeSlots: TimeSlot[];
}

export interface AddAppointmentsDto {
  ordinationId?: number;
  datesWithSlots: DateWithSlots[];
}

export interface UpdateAppointmentDto {
  newDate: string;      
  newStartTime: string; 
  newEndTime: string;   
  isAvailable: boolean;
}


@Injectable() export class AppointmentService{

  constructor(private http: HttpClient) {}
  private apiUrl = `${environment.apiUrl}/appointments`;

  addAppointments(appointmentsDto: AddAppointmentsDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, appointmentsDto);
  }

  getAppointmentsByDate(ordinationId: number, date: Date): Observable<Appointment[]> {
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
    return this.http.get<Appointment[]>(`${this.apiUrl}/${ordinationId}/${formattedDate}`);
  }

  getAllAppointments(ordinationId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/all/${ordinationId}`);
  }  

  updateAppointment(appointmentId: number, updateDto: UpdateAppointmentDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${appointmentId}`, updateDto);
  }

  deleteAppointment(appointmentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${appointmentId}`);
  }

  toggleAvailability(appointmentId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/toggle-availability/${appointmentId}`, {});
  }
}
