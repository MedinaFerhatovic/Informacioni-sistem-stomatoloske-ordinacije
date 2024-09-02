import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { ForgotPasswordComponent } from "./components/login/forgotPassword.component";
import { AdminComponent } from "./components/login/admin/admin.component";
import { OrdinationComponent } from "./components/login/admin/ordination/ordination.component";

const routes: Routes = [
    {path: "", redirectTo: '/login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'forgotPassword', component: ForgotPasswordComponent},
    {path: 'admin', component: AdminComponent},
    {path: 'ordination', component: OrdinationComponent}
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