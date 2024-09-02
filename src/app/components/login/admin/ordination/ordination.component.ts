import { Ordination } from "../../../../models/ordination";
import { OrdinationService, OrdinationDto } from "../../../../services/ordination.service";
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ordination',
  templateUrl: './ordination.component.html',
  styleUrls: ['./ordination.component.css']
})
export class OrdinationComponent implements OnInit {

  newOrdination: OrdinationDto = {
    name: '',
    phoneNumber: '',
    ownerEmail: '',
    address: ''
  };

  constructor(private ordinationService: OrdinationService) { }

  ordinations: Ordination[] = [];

  ngOnInit(): void {
    this.loadOrdinances();
  }

  activeTab: String = "users"

  panels: string[] = ["ordinations", "users", "bookings"]

  checkOrd(panel: string) {
    if (this.activeTab == panel) {
      return true
    }

    return false;

  }

  openPanel(panel: string) {
    this.activeTab = panel;
  }

  addOrdination(ordinationDto: OrdinationDto): void {
    this.ordinationService.addOrdination(ordinationDto).subscribe((response: Ordination) => {
      this.ordinations.push(response); // Dodajte objekat tipa `Ordination`
      this.newOrdination = { name: '', phoneNumber: '', ownerEmail: '', address: '' }; // Reset form
    });
  }

  loadOrdinances(): void {
    this.ordinationService.getOrdinations().subscribe((data: Ordination[]) => {
      this.ordinations = data; // Niz tipa `Ordination`
    });
  }
}


