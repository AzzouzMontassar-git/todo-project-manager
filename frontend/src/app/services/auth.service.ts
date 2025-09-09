import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.API_URL}/auth`;

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  saveAuthData(token: string, user: any): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', JSON.stringify(user));
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getUser(): any | null {
    const user = localStorage.getItem('authUser');
    return user ? JSON.parse(user) : null;
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserByEmail(email: string): Observable<any> {
    const token = this.getToken();
    return this.http.get(`${environment.API_URL}/users/email/${email}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}
