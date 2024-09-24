import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../../services/reservation.service';
import { Reservation } from '../../../models/reservation';
import { OrdinationService } from '../../../services/ordination.service';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {
  reservations: Reservation[] = [];
  ordinationId: number | null = null;

  totalReservations: number = 0;
  pendingReservations: number = 0;
  acceptedReservations: number = 0;
  rejectedReservations: number = 0;

  private refreshSubscription: Subscription | null = null;

  constructor(
    private reservationService: ReservationService,
    private ordinationService: OrdinationService
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (user.role === 'doktor') {
      this.ordinationService.getOrdinationByOwner(user.userId).subscribe(
        ordination => {
          this.ordinationId = ordination.ordinationId;
          if (this.ordinationId) {
            this.loadReservations();
            this.startRefresh();
          }
        },
        error => {
          alert('Došlo je do greške prilikom dohvaćanja podataka o ordinaciji.');
        }
      );
    }
  }

  loadReservations(): void {
    if (this.ordinationId) {
      this.reservationService.getReservationsByOrdination(this.ordinationId).subscribe(
        data => {
          this.reservations = data;
          this.calculateStats();
        },
        error => console.error('Greška pri dobijanju rezervacija:', error)
      );
    }
  }

  updateStatus(reservationId: number, newStatus: string): void {
    this.reservationService.updateReservationStatus(reservationId, newStatus).subscribe(
      () => {
        alert('Status uspješno ažuriran.');
        this.loadReservations(); 
      },
      error => {
        alert('Došlo je do greške prilikom ažuriranja statusa.');
      }
    );
  }

  startRefresh(): void {
    this.refreshSubscription = timer(0, 5000).subscribe(() => {
      this.loadReservations(); 
    });
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe(); 
    }
  }
  

  calculateStats(): void {
    this.totalReservations = this.reservations.length;
    this.pendingReservations = this.reservations.filter(res => res.status === 'na cekanju').length;
    this.acceptedReservations = this.reservations.filter(res => res.status === 'odobrena').length;
    this.rejectedReservations = this.reservations.filter(res => res.status === 'odbijena').length;
  }

  formatTime(time: string): string {
    return time ? time.slice(0, 5) : '';
  }
  
}
