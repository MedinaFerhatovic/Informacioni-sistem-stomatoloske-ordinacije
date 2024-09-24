import { Component, OnInit } from '@angular/core';
import { DentalRecordService, DentalRecordDto, VisitDto } from '../../../services/dentalRecord.service';
import { Ordination } from '../../../models/ordination';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrdinationService } from '../../../services/ordination.service';
import { DentalRecord } from '../../../models/dentalRecord';
import { User } from '../../../models/users';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-dentalRecord',
  templateUrl: './dentalRecord.component.html',
  styleUrls: ['./dentalRecord.component.css']
})
export class DentalRecordComponent implements OnInit {

  ordination?: Ordination;
  dentalRecord: DentalRecordDto = new DentalRecordDto();
  dentalRecordForm: FormGroup;
  dentalRecords: DentalRecord[] = [];

  selectedRecord: any = {};
  selectedUser: User | null = null;
  selectedOrdination: Ordination | null = null;
  showDetails: boolean = false;

  showDeleteConfirmation: boolean = false;
  RecordToDelete: number | null = null;

  editingRecord = false;
  newRecord: any = {};
  visitForm: FormGroup;
  allVisits: VisitDto[] = [];

  showAddVisitForm = false;



  showForm: boolean = false;

  constructor(private fb: FormBuilder, private dentalRecordService: DentalRecordService, private ordinationService: OrdinationService, private userService: UserService) {
    this.dentalRecordForm = this.fb.group({
      ordinationId: [{ value: '', disabled: true }], 
      dentalRecordId:[{ value: '', disabled: true }],
      ordinationName: [{ value: '', disabled: true }],
      ordinationPhoneNumber: [{ value: '', disabled: true }], 
      ordinationAddress: [{ value: '', disabled: true }], 
      patientEmail: ['', [Validators.required, Validators.email]],
      patientFirstName: ['', Validators.required],
      patientLastName: ['', Validators.required],
      visitDate: ['', Validators.required],
      examination: ['', Validators.required],
      number:  [{ value: '', disabled: true }],
      recipe: [''],
      addition: ['']
    });
    this.visitForm = this.fb.group({
      visitDate: ['', Validators.required],
      examination: ['', Validators.required],
      recipe: [''],
      addition: ['']
    });
   }

   closeForm(): void {
    this.showForm = false;
    this.showAddVisitForm = false;
  }


  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
  
    if (user.role === 'doktor') {
      this.ordinationService.getOrdinationByOwner(user.userId).subscribe(
        ordination => {
          this.ordination = ordination;
          this.dentalRecordForm.patchValue({ ordinationId: ordination?.ordinationId, ordinationName: ordination?.name,
            ordinationPhoneNumber: ordination?.phoneNumber,
            ordinationAddress: ordination?.address });
          if (this.ordination) {
            this.loadDentalRecords();
          }
        },
        error => {
          alert('Došlo je do greške prilikom dohvaćanja podataka o ordinaciji.');
        }
      );
    }
  }

  createDentalRecord() {
    const dentalRecordDto = {
      ...this.dentalRecordForm.value,
      ordinationId: this.ordination?.ordinationId
      };
  
    this.dentalRecordService.createDentalRecord(dentalRecordDto).subscribe(
      response => {
        alert('Stomatološki karton je uspješno kreiran.');
        this.loadDentalRecords();
        this.closeForm();
      },
      error => {
        alert('Došlo je do greške prilikom kreiranja stomatološkog kartona.');
        console.error(error);
      }
    );
  }

  formatDate(date: Date | string): string {
    if (typeof date === 'string') {
      date = new Date(date);
    }
  
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      console.error('Nevažeći datum:', date);
      return ''; 
    }
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
  
    return `${day}.${month}.${year}.`;
  }
  
  loadDentalRecords(): void {
    if (this.ordination?.ordinationId) {
      this.dentalRecordService.getDentalRecordsByOrdination(this.ordination.ordinationId).subscribe(
        (data) => {
          console.log('Podaci korisnika:', data);
          this.dentalRecords = data;
        },
        (error) => console.error('Greška pri dobijanju stomatoloških kartona:', error)
      );
    }
  }

  viewDentalRecordDetails(id: number): void {
    this.allVisits = [];
    if (id) {
      this.dentalRecordService.getDentalRecordById(id).subscribe(
        (data) => {
          this.selectedRecord = data;

          this.dentalRecordService.getVisitsByDentalRecordId(id).subscribe(
            (visits) => {
              this.allVisits = visits; 
            },
            (error) => console.error('Greška pri dobijanju posjeta:', error)
          );

          if (this.selectedRecord.visitDate) {
            const date = new Date(this.selectedRecord.visitDate);
            if (!isNaN(date.getTime())) {
              this.selectedRecord.visitDate = this.formatDate(date);
            } else {
              console.error('Nevažeći datum:', this.selectedRecord.visitDate);
              this.selectedRecord.visitDate = ''; 
            }
          }
  
          this.checkForVisits(id);
          this.showDetails = true;
  
          if (this.selectedRecord.patientId) {
            this.userService.getUserById(this.selectedRecord.patientId).subscribe(
              (user) => {
                this.selectedUser = user;
                this.dentalRecordForm.patchValue({
                  patientEmail: user.email,
                  patientFirstName: user.firstName,
                  patientLastName: user.lastName,
                  visitDate: this.selectedRecord.visitDate
                });
              },
              (error) => console.error('Greška pri dobijanju podataka o korisniku:', error)
            );
          }
  
          if (this.selectedRecord.ordinationId) {
            this.ordinationService.getOrdinationById(this.selectedRecord.ordinationId).subscribe(
              (ordination) => {
                this.selectedOrdination = ordination;
              },
              (error) => console.error('Greška pri dobijanju podataka o ordinaciji:', error)
            );
          }
        },
        (error) => console.error('Greška pri dobijanju detalja korisnika:', error)
      );
    } else {
      console.error('Nevažeći ID korisnika:', id);
    }
  }
  

  checkForVisits(id: number): void {
    this.dentalRecordService.getVisitsByDentalRecordId(id).subscribe(
      (visits) => {
        if (visits && visits.length > 0) {
          console.log('Pozivanje updateVisitsForDentalRecord za ID:', id);
          this.updateVisitsForDentalRecord(id); 
        } else {
          console.log('Karton nema dodatne posjete.');
        }
      },
      (error) => console.error('Greška pri dobijanju posjeta:', error)
    );
  }
  
  updateVisitsForDentalRecord(dentalRecordId: number): void {
    this.dentalRecordService.getVisitsByDentalRecordId(dentalRecordId).subscribe(
      (visits) => {
        console.log('Primljeni podaci o posjetama:', visits);
        this.allVisits = visits.map(visitDto => {
          // Formatiraj datum posjete
          if (visitDto.visitDate) {
            const date = new Date(visitDto.visitDate);
            if (!isNaN(date.getTime())) {
              visitDto.visitDate = this.formatDate(date);
            } else {
              console.error('Nevažeći datum:', visitDto.visitDate);
              visitDto.visitDate = '';
            }
          }
          return visitDto;
        });
      },
      (error) => console.error('Greška pri dobijanju posjeta:', error)
    );
  }
  
  
  
  openDeleteConfirmation(userId: number): void {
    this.showDeleteConfirmation = true;
    this.RecordToDelete = userId;
  }

  closeDeleteConfirmation(): void {
    this.showDeleteConfirmation = false;
    this.RecordToDelete = null;
  }

  confirmDelete(): void {
    if (this.RecordToDelete !== null) {
      this.deleteDentalRecord(this.RecordToDelete);
      this.closeDeleteConfirmation();
    }
  }

  deleteDentalRecord(id: number): void {
    this.dentalRecordService.deleteDentalRecord(id).subscribe(
      () => {
        this.dentalRecords = this.dentalRecords.filter(d => d.dentalRecordId !== id);
      },
      (error) => console.error('Greška pri brisanju korisnika:', error)
    );
  }

  openForm() {
    this.showForm = true;
    this.showAddVisitForm = false;
    this.showDeleteConfirmation = false;
    this.showDetails = false;
  }

  openVisitForm(dentalRecordId: number): void {
    this.showAddVisitForm = true;
    this.dentalRecordForm.patchValue({ dentalRecordId: dentalRecordId }); 
    this.selectedRecord.dentalRecordId = dentalRecordId;
  }
  
  
  /*openVisitForm() {
    this.showForm = false;
    this.showAddVisitForm = true;
    this.showDeleteConfirmation = false;
    this.showDetails = false;
  }*/

  closeDetails(): void {
    this.showDetails = false;
  }




  addVisit(dentalRecordId: number): void {
    if (this.visitForm.valid) {
      const visitDto: VisitDto = this.visitForm.value;
  
      this.dentalRecordService.addVisit(dentalRecordId, visitDto).subscribe(
        () => {
          alert('Detalji posjete su uspješno dodani.');
          this.updateVisitsForDentalRecord(dentalRecordId);  
          this.closeForm();
        },
        (error) => {
          alert('Došlo je do greške prilikom dodavanja detalja posjete.');
          console.error(error);
        }
      );
    }
  }
  
}

  
  


  

