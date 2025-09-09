// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Modèle User
export interface User {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  password?: string;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080/api/users'; // URL backend

  constructor(private http: HttpClient) { }

  // Obtenir tous les utilisateurs
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // Obtenir utilisateur par ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // Obtenir utilisateur par email
  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/email/${email}`);
  }

   createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user); // ✅ corrigé ici
  }


  // Mettre à jour un utilisateur
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  // Supprimer un utilisateur par ID
  deleteUserById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Supprimer un utilisateur par email
  deleteUserByEmail(email: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/email/${email}`);
  }

  

  // Mettre à jour le mot de passe
  updatePassword(email: string, newPassword: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/update-password/${email}`, { newPassword });
  }
}
