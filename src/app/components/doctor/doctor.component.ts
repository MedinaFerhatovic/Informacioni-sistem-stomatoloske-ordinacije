import { Component, HostListener, OnInit } from '@angular/core';
import { Ordination } from '../../models/ordination';
import { OrdinationService } from '../../services/ordination.service';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment } from '../../models/appointment';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})

export class DoctorComponent implements OnInit {
  ordination?: Ordination;
  appointmentsByDate: { date: Date, appointments: Appointment[] }[] = [];
  totalAppointments: number = 0;
  freeAppointments: number = 0;
  takenAppointments: number = 0;



  constructor(private ordinationService: OrdinationService, private appointmentService: AppointmentService) {}


  isSidebarCollapsed = false;

  ngOnInit(): void {
   const user = JSON.parse(localStorage.getItem("user") || '{}');
    
    if (user.role === 'doktor') {
      this.ordinationService.getOrdinationByOwner(user.userId).subscribe(
        ordination => {
          this.ordination = ordination;
          if (this.ordination) {
            this.loadAllAppointments();
          }
        },
        error => {
          alert("Došlo je do greške prilikom dohvaćanja podataka o ordinaciji.");
        }
      );
    }
  }

  loadAllAppointments() {
    if (!this.ordination) return;

    this.appointmentService.getAllAppointments(this.ordination.ordinationId!).subscribe(
      (appointments: Appointment[]) => {
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
      const dateStr = new Date(appointment.date).toLocaleDateString('en-GB');
      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }
      grouped[dateStr].push(appointment);
    });

    return Object.keys(grouped).map(dateStr => ({
      date: new Date(dateStr),
      appointments: grouped[dateStr]
    }));
  }
  //ordinations: Ordination[] = [];

  activeTab: String = "spline"

  panels: string[] = ["spline", "ordinations", "appointments", "dentalrecord"]

  checkOrd(panel: string) {
    if (this.activeTab == panel) {
      return true
    }

    return false;

  }

  openPanel(panel: string) {
    this.activeTab = panel;
  }


  isShow!: boolean;
  topPosToStartShowing = 100;

  @HostListener('window:scroll')
  checkScroll() {

    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    if (scrollPosition >= this.topPosToStartShowing) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }

  logoutUser(){
    localStorage.removeItem("user");
    window.location.href = "login";
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  
    if (!this.isSidebarCollapsed) {
      setTimeout(() => {
      }, 300); 
    }
  }
  

}
