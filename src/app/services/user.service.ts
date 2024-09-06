import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { User } from "../models/users";
import { Observable } from "rxjs";

interface ApiResponse {
    StatusCode: number;
    message: string;
  }
  
  // Definiši model za telo zahteva
  interface ResetPasswordRequest {
    email: string;
    newPassword: string;
  }
  

@Injectable() export class UserService {

    constructor(private http: HttpClient) {}

    loginUser(email: string, password: string) {
        const url = `${environment.apiUrl}/users/login/${email}/${password}`;
        return this.http.get<User>(url);
    }
    
    resetPassword(email: string, newPassword: string): Observable<ApiResponse> {
        const url = `${environment.apiUrl}/users/resetPassword`;
        const body: ResetPasswordRequest = { email, newPassword };
        return this.http.post<ApiResponse>(url, body);
    }

    getUserById(id: number): Observable<User> {
      const url = `${environment.apiUrl}/users/${id}`;
      return this.http.get<User>(url);
    }

    getUsers(): Observable<User[]> {
      const url = `${environment.apiUrl}/users`;
      return this.http.get<User[]>(url);
    }

    updateUser(user: User): Observable<void> {
      const url = `${environment.apiUrl}/users`;
      return this.http.put<void>(url, user);
    }

    deleteUser(id: number): Observable<void> {
      const url = `${environment.apiUrl}/users/${id}`;
      return this.http.delete<void>(url);
    }

    addUser(user: User): Observable<User> {
      const url = `${environment.apiUrl}/users`;
      return this.http.post<User>(url, user);
    }
  
  
  
  
}