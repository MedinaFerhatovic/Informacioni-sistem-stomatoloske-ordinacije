import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { ForgotPasswordComponent } from "./components/login/forgotPassword.component";
import { AdminComponent } from "./components/login/admin/admin.component";
import { OrdinationComponent } from "./components/login/admin/ordination/ordination.component";
import { UserComponent } from "./components/login/admin/user/user.component";
import { DoctorComponent } from "./components/doctor/doctor.component";
import { AppointmentComponent } from "./components/doctor/appointment/appointment.component";
import { DentalRecordComponent } from "./components/doctor/dentalRecord/dentalRecord.component";
import { ReservationComponent } from "./components/doctor/reservation/reservation.component";

const routes: Routes = [
    {path: "", redirectTo: '/login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'forgotPassword', component: ForgotPasswordComponent},
    {path: 'admin', component: AdminComponent},
    {path: 'ordination', component: OrdinationComponent},
    {path: 'user', component: UserComponent},
    {path: 'doctor', component: DoctorComponent},
    {path: 'appointment', component: AppointmentComponent},
    {path: 'dentalRecord', component: DentalRecordComponent},
    {path: 'reservation', component: ReservationComponent}
];

@NgModule({

    declarations:[],
    imports: [
        CommonModule,
        RouterModule.forRoot(routes),
    ],
    exports: [
        RouterModule
    ],

})

export class AppRoutesModule {}