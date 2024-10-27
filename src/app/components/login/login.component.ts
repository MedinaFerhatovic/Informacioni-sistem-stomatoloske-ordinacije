import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { User } from '../../models/users';
import { OrdinationService } from '../../services/ordination.service';
import { Ordination } from '../../models/ordination';
import { MatSnackBar } from '@angular/material/snack-bar';  // Import za MatSnackBar

interface ApiResponse {
  StatusCode: number;
  message: string;
  user: User;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  LogInForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required, Validators.minLength(8)]),
    rememberMe: new FormControl(false) 
  });

  u?: User;
  ordination?: Ordination; 
  loginFailed: boolean = false;
  errorMessage: string = ""; // Promjenljiva za prikaz greške
  
  constructor(
    private userService: UserService,
    private ordinationService: OrdinationService,
    private router: Router,
    private snackBar: MatSnackBar  // Dodavanje MatSnackBar-a u konstruktor
  ) {}

  ngOnInit(): void {
    this.loadRememberedCredentials();

    let localUser = localStorage.getItem("user");
      
    if (localUser != undefined) {
      this.u = JSON.parse(localUser);
    }
  }

  loginUser() {
    if (!this.LogInForm.valid) {
        this.showSnackbar("Molimo unesite ispravne podatke.", "Zatvori");  // Prikaz poruke umjesto alert-a
        return;
    }

    const email = this.LogInForm.value.email!;
    const password = this.LogInForm.value.password!;
    const rememberMe = this.LogInForm.value.rememberMe!;

    this.userService.loginUser(email, password).subscribe((response: ApiResponse) => {
        console.log('Vraćeni odgovor:', response);

        const user = response.user;
    
        if (user == null) {
            this.errorMessage = "Podaci nisu tačni. Pokušajte ponovo.";  // Prikaz greške u `mat-card`
            this.loginFailed = true;
            this.showSnackbar(this.errorMessage, "Zatvori");  // Prikaz greške i u `MatSnackBar`
        } else {
            localStorage.setItem("user", JSON.stringify(user));
            console.log('Uloga korisnika:', user.role);

            if (rememberMe) {
              this.rememberUserCredentials(email, password); 
            } else {
              this.clearRememberedCredentials(); 
            }
    
            // Preusmjeravanje korisnika na osnovu uloge
            if (user.role === "admin") {
                this.router.navigate(['/admin']);
            } else if (user.role === "doktor") {
                this.router.navigate(['/doctor']); 
            } else {
                this.showSnackbar("Nevažeći korisnik!", "Zatvori");
            }
        }
    }, (error) => {
        // Prikaz greške prilikom poziva API-a
        console.error('Greška prilikom prijave:', error);
        this.errorMessage = "Greška prilikom prijave. Pokušajte ponovo."; // Prikaz greške u `mat-card`
        this.loginFailed = true;
        this.showSnackbar(this.errorMessage, "Zatvori");
    });
  }

  // Prikaz Snackbar poruke sa stilizacijom
  private showSnackbar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }

  private rememberUserCredentials(email: string, password: string): void {
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);
    localStorage.setItem("rememberMe", 'true');  
  }

  private loadRememberedCredentials(): void {
    const email = localStorage.getItem("email") || "";
    const password = localStorage.getItem("password") || "";
    const rememberMe = localStorage.getItem("rememberMe") === 'true';

    this.LogInForm.setValue({
      email: email,
      password: password,
      rememberMe: rememberMe
    });
  }

  private clearRememberedCredentials(): void {
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    localStorage.removeItem("rememberMe");
  }
}
