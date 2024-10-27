import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AppointmentService, TimeSlot, UpdateAppointmentDto } from '../../../services/appointment.service';
import { OrdinationService } from '../../../services/ordination.service';
import { Ordination } from '../../../models/ordination';
import { Appointment } from '../../../models/appointment';

import { AbstractControl, ValidatorFn } from '@angular/forms';

export function dateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
    return dateRegex.test(control.value) ? null : { 'pattern': true };
  };
}

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {
  appointmentForm: FormGroup;
  ordination?: Ordination;
  minDate: Date;
  showForm: boolean = false;
  appointmentsByDate: { date: Date, appointments: Appointment[] }[] = [];
  selectedDate: Date | null = null;
  appointmentToEdit: Appointment | null = null;
  editForm: FormGroup;
  showEditForm: boolean = false;

  totalAppointments: number = 0;
  freeAppointments: number = 0;  
  takenAppointments: number = 0;

  dropdownOpenDates: Set<Date> = new Set();

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private ordinationService: OrdinationService
  ) {
    this.minDate = new Date();
    this.appointmentForm = this.fb.group({
      date: ['', [Validators.required, dateValidator()]],
      timeSlots: this.fb.array([]),
      ordinationId: [{ value: '', disabled: true }] 
    });
    this.editForm = this.fb.group({
      appointmentId: [{ value: '', disabled: true }],
      ordinationId: [{ value: '', disabled: true }],
      date: ['', [Validators.required, Validators.pattern(/^\d{2}\.\d{2}\.\d{4}$/)]],
      startTime: ['', [Validators.required, Validators.pattern(/^\d{2}:\d{2}$/)]],
      endTime: ['', [Validators.required, Validators.pattern(/^\d{2}:\d{2}$/)]]
    });
  }

  toggleDropdown(date: Date) {
    if (this.dropdownOpenDates.has(date)) {
      this.dropdownOpenDates.delete(date);
    } else {
      this.dropdownOpenDates.add(date);
    }
  }

  isDropdownOpen(date: Date): boolean {
    return this.dropdownOpenDates.has(date);
  }

  selectDate(date: Date) {
    console.log('Selected Date:', date); 
    this.selectedDate = date;
    this.loadAppointments(date);
  }  

  
  editAppointment(appointment: Appointment) {
    console.log('Appointment:', appointment);
  
    this.appointmentToEdit = appointment;
  
    const appointmentDate = new Date(appointment.date);
  
    this.editForm.patchValue({
      appointmentId: appointment.appointmentId, 
      ordinationId: appointment.ordinationID,
      date: this.formatDate(appointmentDate),
      startTime: appointment.startTime,
      endTime: appointment.endTime
    });
  
    this.showEditForm = true;
  }
  
  
  closeEditForm() {
    this.showEditForm = false;
    this.appointmentToEdit = null;
  }
  
  onUpdate() {
    if (this.editForm.invalid) {
      return;
    }
    
    this.editForm.get('appointmentId')?.enable();
    const appointmentId = this.editForm.value.appointmentId;
  
    const date = this.parseDate(this.editForm.value.date); 
    const formattedDate = this.formatDate(date); 
  
    // Formatiranje vremena za početak i kraj
    const startTime = this.formatTime(this.editForm.value.startTime);
    const endTime = this.formatTime(this.editForm.value.endTime);
  
    console.log("ID termina:", appointmentId);
    console.log('Ažuriranje termina sa ID-jem:', appointmentId);
  
    const updateDto: UpdateAppointmentDto = {
      newDate: formattedDate, 
      newStartTime: startTime,
      newEndTime: endTime,
      isAvailable: true 
    };
  
    this.appointmentService.updateAppointment(appointmentId, updateDto).subscribe(
      () => {
        alert('Termin je uspješno ažuriran.');
        this.closeEditForm();
        this.loadAllAppointments();
      },
      error => {
        alert('Došlo je do greške prilikom ažuriranja termina.');
        console.error(error);
      }
    );
  }
  
  
  isValidDate(date: Date): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }
  
  
  formatDate(date: Date): string {
    return this.isValidDate(date) ? `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}` : '';
  }
  
  
  parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split('.').map(Number);
    return new Date(year, month - 1, day);
  }
  
  

  formatTime(time: string): string {
    return `${time}:00`;
  }  
  
  
  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (user.role === 'doktor') {
      this.ordinationService.getOrdinationByOwner(user.userId).subscribe(
        ordination => {
          this.ordination = ordination;
          this.appointmentForm.patchValue({ ordinationId: ordination?.ordinationId });
          if (this.ordination) {
            this.loadAllAppointments(); 
          }
        },
        error => {
          alert('Došlo je do greške prilikom dohvaćanja podataka o ordinaciji.');
        }
      );
    }
  }

  get timeSlots() {
    return this.appointmentForm.get('timeSlots') as FormArray;
  }

  addTimeSlot() {
    this.timeSlots.push(this.fb.group({
      startTime: ['', [Validators.required, Validators.pattern(/^\d{2}:\d{2}$/)]],
      endTime: ['', [Validators.required, Validators.pattern(/^\d{2}:\d{2}$/)]]
    }, { validator: this.timeSlotValidator }));
  }

  timeSlotValidator(group: FormGroup) {
    const startTime = group.get('startTime')?.value;
    const endTime = group.get('endTime')?.value;
    
    if (startTime && endTime && startTime >= endTime) {
      return { invalidTimeSlot: true };
    }
    return null;
  }

  removeTimeSlot(index: number) {
    this.timeSlots.removeAt(index);
  }

  onSubmit() {
    if (this.appointmentForm.invalid) {
      return;
    }
  
    const date = this.parseDate(this.appointmentForm.value.date);
    const formattedDate = this.formatDate(date);
  
    const timeSlots = this.appointmentForm.value.timeSlots.map((slot: TimeSlot) => ({
      startTime: this.formatTime(slot.startTime),
      endTime: this.formatTime(slot.endTime)
    }));
  
    const appointmentsDto = {
      ordinationId: this.ordination?.ordinationId,
      datesWithSlots: [{ date: formattedDate, timeSlots }]
    };
  
    this.appointmentService.addAppointments(appointmentsDto).subscribe(
      () => {
        alert('Termini su uspješno dodani.');
        this.loadAllAppointments();
        this.closeForm();
      },
      error => {
        alert('Došlo je do greške prilikom dodavanja termina.');
        console.error(error);
      }
    );
  }

  closeForm(): void {
    this.showForm = false;
  }

  openForm() {
    this.showForm = true;
  }

  formatTimeDisplay(time: string): string {
    return time.slice(0, 5);
  }  

  loadAllAppointments() {
    if (!this.ordination) return;
    
    this.appointmentService.getAllAppointments(this.ordination.ordinationId!).subscribe(
      (appointments: Appointment[]) => {
        console.log('All appointments fetched:', appointments); 
        this.appointmentsByDate = this.groupAppointmentsByDate(appointments);
        this.totalAppointments = appointments.length;
        this.freeAppointments = appointments.filter(a => a.available).length;
        this.takenAppointments = appointments.filter(a => !a.available).length;
      },
      error => {
        alert('Došlo je do greške prilikom dohvaćanja svih termina.');
        console.error(error);
      }
    );
  }
  
  groupAppointmentsByDate(appointments: Appointment[]): { date: Date, appointments: Appointment[] }[] {
    const grouped: { [key: string]: Appointment[] } = {};
  
    appointments.forEach(appointment => {
      const dateStr = new Date(appointment.date);
      if (!this.isValidDate(new Date(appointment.date))) {
        console.warn(`Invalid date encountered: ${appointment.date}`);
        return; 
      }
      const dateKey = this.formatDate(dateStr);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      appointment.startTime = this.formatTimeDisplay(appointment.startTime);
      appointment.endTime = this.formatTimeDisplay(appointment.endTime);
      grouped[dateKey].push(appointment);
    });
  
    return Object.keys(grouped).map(dateKey => ({
      date: this.parseDate(dateKey),  
      appointments: grouped[dateKey]
    }));
  }
  
  

  toggleAvailability(appointmentID: number, isAvailable: boolean) {
    const status = isAvailable ? 'Nedostupan' : 'Dostupan';
    if (confirm(`Da li ste sigurni da želite označiti ovaj termin kao ${status}?`)) {
      this.appointmentService.toggleAvailability(appointmentID).subscribe(
        () => {
          alert(`Termin je uspješno označen kao ${status}.`);
          this.loadAllAppointments();
        },
        error => {
          alert('Došlo je do greške prilikom promjene dostupnosti termina.');
          console.error(error);
        }
      );
    }
  }
  
  deleteAppointment(appointmentID: number) {
    if (confirm('Da li ste sigurni da želite obrisati ovaj termin?')) {
      this.appointmentService.deleteAppointment(appointmentID).subscribe(
        () => {
          alert('Termin je uspješno obrisan.');
          this.loadAllAppointments();
        },
        error => {
          alert('Došlo je do greške prilikom brisanja termina.');
          console.error(error);
        }
      );
    }
  }

  loadAppointments(date: Date) {
  }
}
