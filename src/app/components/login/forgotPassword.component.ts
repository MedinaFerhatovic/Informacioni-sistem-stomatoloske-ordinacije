import { Component} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgotPassword',
  templateUrl: './forgotPassword.component.html',
  styleUrls: ['./forgotPassword.component.css']
})
export class ForgotPasswordComponent {

    forgotPasswordForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      newPassword: new FormControl("", [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl("", [Validators.required])
    });
  
    errorMessage: string | null = null;
  
    constructor(
      private userService: UserService,
      private router: Router
    ) {}
  
    resetPassword() {
      if (!this.forgotPasswordForm.valid) {
        this.errorMessage = "Molimo unesite ispravne podatke.";
        return;
      }
  
      const email = this.forgotPasswordForm.value.email!;
      const newPassword = this.forgotPasswordForm.value.newPassword!;
      const confirmPassword = this.forgotPasswordForm.value.confirmPassword!;
  
      if (newPassword !== confirmPassword) {
        this.errorMessage = "Lozinke se ne podudaraju.";
        return;
      }
  
      this.userService.resetPassword(email, newPassword).subscribe(response => {
          this.errorMessage = response.message;
          this.router.navigate(['/login']);
      }, error => {
        this.errorMessage = "Greška prilikom resetovanja lozinke. Molim pokušajte ponovo.";
      });
    }
  
    cancel() {
      this.router.navigate(['/login']);
    }
  }