import { Component, OnInit } from '@angular/core';
import { OrdinationService, OrdinationDto } from '../../../../services/ordination.service';
import { Ordination } from '../../../../models/ordination';
import { UserService } from '../../../../services/user.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-ordination',
  templateUrl: './ordination.component.html',
  styleUrls: ['./ordination.component.css']
})
export class OrdinationComponent implements OnInit {
  ordinations: Ordination[] = [];
  selectedOrdination: any = {};
  showForm: boolean = false;
  editingOrdination = false;
  ownerEmail: string = '';
  newOrdination: any = {};
  showDetails: boolean = false;

  constructor(private ordinationService: OrdinationService, private userService: UserService) {}

  ngOnInit(): void {
    this.loadOrdinations();
  }

  loadOrdinations(): void {
    this.ordinationService.getOrdinations().subscribe(
      (data) => {
        console.log('Podaci ordinacije:', data);
        this.ordinations = data;
      },
      (error) => console.error('Greška pri dobijanju ordinacija:', error)
    );
  }

  closeForm(): void {
    this.showForm = false;
  }

  getOwnerEmail(ownerId: number): Observable<any> {
    console.log("Dobijam email za vlasnika sa ID-om:", ownerId); // Dodaj log za provjeru ID-a
  
    return this.userService.getUserById(ownerId).pipe(
      map(user => {
        console.log("Dobijeni podaci korisnika:", user);  // Ovdje bi trebali dobiti korisnika
        return user.email ?? '';  // Provjeravamo da li postoji email
      })
    );
  }
  
  

  addOrdination(ordinationDto : OrdinationDto): void {
    this.ordinationService.addOrdination(ordinationDto).subscribe(
      (data) => {
        this.ordinations.push(data);
        this.closeForm();
      },
      (error) => console.error('Greška pri dodavanju ordinacije:', error)
    );
  }

  openForm(ordination?: Ordination): void {
    if (ordination) {
      this.editingOrdination = true;
      this.newOrdination = {
        ordinationId: ordination.ordinationId,
        name: ordination.name,
        phoneNumber: ordination.phoneNumber,
        ownerEmail: this.getOwnerEmail(ordination.owner),
        address: ordination.address,
      };

    } else {
      this.editingOrdination = false;
      this.newOrdination = {
        name: '',
        phoneNumber: '',
        ownerEmail: '',
        address: ''
      };
      this.showForm = true;
    }
  }

  showDeleteConfirmation: boolean = false;
  ordinationToDelete: number | null = null;

  openDeleteConfirmation(ordinationId: number): void {
    this.showDeleteConfirmation = true;
    this.ordinationToDelete = ordinationId;
  }

  closeDeleteConfirmation(): void {
    this.showDeleteConfirmation = false;
    this.ordinationToDelete = null;
  }

  confirmDelete(): void {
    if (this.ordinationToDelete !== null) {
      this.deleteOrdination(this.ordinationToDelete);
      this.closeDeleteConfirmation();
    }
  }

  deleteOrdination(id: number): void {
    this.ordinationService.deleteOrdination(id).subscribe(
      () => {
        this.ordinations = this.ordinations.filter(o => o.ordinationId !== id);
      },
      (error) => console.error('Greška pri brisanju ordinacije:', error)
    );
  }

  viewOrdinationDetails(id: number): void {
    if (id) {
      this.ordinationService.getOrdinationById(id).subscribe(
        (data) => {
          this.selectedOrdination = data;
          this.showDetails = true;
        },
        (error) => console.error('Greška pri dobijanju detalja ordinacije:', error)
      );
    } else {
      console.error('Nevažeći ID ordinacije:', id);
    }
  }

  editOrdination(): void {
    this.editingOrdination = true;
  }

  closeDetails(): void {
    this.selectedOrdination = null;
    this.showDetails = false;
  }

  startEditing(ordination: Ordination): void {
    this.editingOrdination = true;
    this.newOrdination = { ...ordination, ownerEmail: this.ownerEmail };
    this.showDetails = true;
  }

  updateOrdination(): void {
    console.log('Updating ordination with data:', this.newOrdination);
    if (this.newOrdination.ordinationId) {
      this.ordinationService.updateOrdination(this.newOrdination.ordinationId, this.newOrdination).subscribe(
        () => {
          this.ordinations = this.ordinations.map(o => o.ordinationId === this.newOrdination.ordinationId ? this.newOrdination as Ordination : o);
          this.editingOrdination = false;  
          this.viewOrdinationDetails(this.newOrdination.ordinationId);
          this.showDetails = true;  
        },
        (error) => console.error('Greška pri ažuriranju ordinacije:', error)
      );
    }
  }
  
}
