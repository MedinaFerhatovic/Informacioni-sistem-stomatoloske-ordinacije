import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { User } from '../../models/users';

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
  
  constructor(
    private userService: UserService,
    private router: Router
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
      alert("Molimo unesite ispravne podatke.");
      return;
    }

    const email = this.LogInForm.value.email!;
    const password = this.LogInForm.value.password!;
    const rememberMe = this.LogInForm.value.rememberMe!;

    this.userService.loginUser(email, password).subscribe(u => {
      if (u == null) {
        alert("Nevažeći korisnik!");
      } else {
        localStorage.setItem("user", JSON.stringify(u));
        alert("Uspješno ste se prijavili kao " + u.email);
        this.router.navigate(['/admin']);
      }
    });
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
}