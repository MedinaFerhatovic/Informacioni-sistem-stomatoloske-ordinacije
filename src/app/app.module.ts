import { AppComponent } from "./app.component";
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UserService } from "./services/user.service";
import { LoginComponent } from "./components/login/login.component";
import { ForgotPasswordComponent } from "./components/login/forgotPassword.component";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppRoutesModule } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { AdminComponent } from "./components/login/admin/admin.component";
import { OrdinationComponent } from "./components/login/admin/ordination/ordination.component";
import { OrdinationService } from "./services/ordination.service";
import { FormsModule } from '@angular/forms'; 
import { UserComponent } from "./components/login/admin/user/user.component";
import { DoctorComponent } from "./components/doctor/doctor.component";
import { AppointmentComponent } from "./components/doctor/appointment/appointment.component";
import { AppointmentService } from "./services/appointment.service";
import { DentalRecord } from "./models/dentalRecord";
import { DentalRecordComponent } from "./components/doctor/dentalRecord/dentalRecord.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReservationComponent } from "./components/doctor/reservation/reservation.component";
import { ReservationService } from "./services/reservation.service";
import { DentalRecordService } from "./services/dentalRecord.service";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPasswordComponent,
    AdminComponent,
    OrdinationComponent,
    UserComponent,
    DoctorComponent,
    AppointmentComponent,
    DentalRecordComponent,
    ReservationComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    MatIconModule,
    HttpClientModule,
    AppRoutesModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    FormsModule,
    FontAwesomeModule,
  ],
  providers: [UserService, OrdinationService, AppointmentService, DentalRecordService, ReservationService,
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }