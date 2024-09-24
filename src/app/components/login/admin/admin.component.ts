import { Component, HostListener, OnInit } from '@angular/core';
import { Ordination } from "../../../models/ordination";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit {

  constructor() { }

  isSidebarCollapsed = false;

  ngOnInit(): void {
  }

  ordinations: Ordination[] = [];

  activeTab: String = "users"

  panels: string[] = ["ordinations", "users", "bookings"]

  checkOrd(panel: string) {
    if (this.activeTab == panel) {
      return true
    }

    return false;

  }

  checkUser(panel: string) {
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
