import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, User } from '../../../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  nom: string = '';
  prenom: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private userService: UserService, private router: Router) {}

  register() {
    this.errorMessage = '';
    this.successMessage = '';

    // Validation basique
    if (!this.nom || !this.prenom || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    const newUser: User = {
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      password: this.password,
      role: 'eleve' // rôle par défaut
    };

    this.userService.createUser(newUser).subscribe({
      next: (user) => {
        this.successMessage = 'Compte créé avec succès !';
        this.router.navigate(['/login']);
      },
      error: (err) => {
        if (err.status === 400) {
          this.errorMessage = 'Cette adresse e-mail est déjà utilisée.';
        } else {
          this.errorMessage = 'Erreur lors de la création du compte. Veuillez réessayer.';
        }
      }
    });
  }
}
