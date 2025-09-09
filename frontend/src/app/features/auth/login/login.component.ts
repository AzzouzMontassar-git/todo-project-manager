import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    this.authService.login({ email: this.email, password: this.password })
      .subscribe({
        next: res => {
          // récupérer l'utilisateur via l'API
          this.authService.getUserByEmail(this.email).subscribe({
            next: user => {
              this.authService.saveAuthData(res.token, user);

              const role = user.role?.toLowerCase();
              if (role === 'admin') this.router.navigate(['/dashboard']);
              else this.router.navigate(['/dashboard-client']);
            },
            error: err => {
              this.errorMessage = 'Impossible de récupérer les infos utilisateur';
              console.error(err);
            }
          });
        },
        error: err => {
          this.errorMessage = err.error?.message || 'Email ou mot de passe incorrect';
          console.error(err);
        }
      });
  }
}
