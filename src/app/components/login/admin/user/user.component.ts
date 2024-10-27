import { Component, OnInit } from '@angular/core';
import { User } from '../../../../models/users';
import { UserService } from '../../../../services/user.service';


@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['../ordination/ordination.component.css']
  })
  export class UserComponent implements OnInit {
    users: User[] = [];
    selectedUser: any = {};
    showForm: boolean = false;
    editingUser = false;
    newUser: any = {};
    showDetails: boolean = false;

    showDeleteConfirmation: boolean = false;
    userToDelete: number | null = null;

  constructor(private userService: UserService) {}

  
  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (data) => {
        console.log('Podaci korisnika:', data);
        this.users = data;
      },
      (error) => console.error('Greška pri dobijanju ordinacija:', error)
    );
  }

  addUser(user : User): void {
    this.userService.addUser(user).subscribe(
      (data) => {
        this.users.push(data);
        this.closeForm();
      },
      (error) => console.error('Greška pri dodavanju korisnika:', error)
    );
  }

  deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe(
      () => {
        this.users = this.users.filter(u => u.userId !== id);
      },
      (error) => console.error('Greška pri brisanju korisnika:', error)
    );
  }

  viewUserDetails(id: number): void {
    if (id) {
      this.userService.getUserById(id).subscribe(
        (data) => {
          this.selectedUser = data;
          this.showDetails = true;
        },
        (error) => console.error('Greška pri dobijanju detalja korisnika:', error)
      );
    } else {
      console.error('Nevažeći ID korisnika:', id);
    }
  }

  updateUser(): void {
    console.log('Updating user with data:', this.newUser);
    if (this.newUser.userId) {
      if (!this.newUser.password) {
        this.newUser.password = this.selectedUser.password; // Ovdje koristi staru heširanu lozinku
      }    
      this.userService.updateUser(this.newUser).subscribe(
        () => {
          this.users = this.users.map(u => u.userId === this.newUser.userId ? this.newUser as User : u);
          this.editingUser = false;  
          this.viewUserDetails(this.newUser.userId);
          this.showDetails = true;  
        },
        (error) => console.error('Greška pri ažuriranju korisnika:', error)
      );
    }
  }  


  openForm(user?: User): void {
    if (user) {
      this.editingUser = true;
      this.newUser = {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        role: user.role,
      };
    } else {
      this.editingUser = false;
      this.newUser = {
        name: '',
        phoneNumber: '',
        ownerEmail: '',
        address: '',
      };
    }
    this.showForm = true;
  }
  
  
  editOrdination(): void {
    this.editingUser = true;
  }

  closeDetails(): void {
    this.selectedUser = null;
    this.showDetails = false;
  }

  startEditing(user: User): void {
    this.editingUser = true;
    this.newUser = { ...user};
    this.showDetails = true;
  }

  openDeleteConfirmation(userId: number): void {
    this.showDeleteConfirmation = true;
    this.userToDelete = userId;
  }

  closeDeleteConfirmation(): void {
    this.showDeleteConfirmation = false;
    this.userToDelete = null;
  }

  confirmDelete(): void {
    if (this.userToDelete !== null) {
      this.deleteUser(this.userToDelete);
      this.closeDeleteConfirmation();
    }
  }

  closeForm(): void {
    this.showForm = false;
  }



  }