import { Component, OnInit } from '@angular/core';
import { UserService, User } from './../services/user.service';
import { AuthService } from '././../services/auth.service'; // tu as sûrement déjà un AuthService

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser?: User;
  loading = true;
  errorMessage = '';

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // ✅ récupérer l'ID ou l'email de l’utilisateur connecté depuis AuthService
    const userId = this.authService.getUser(); 
    // ou bien : const email = this.authService.getUserEmail();

    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: (user) => {
          this.currentUser = user;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = "Impossible de charger le profil.";
          this.loading = false;
        }
      });
    } else {
      this.errorMessage = "Utilisateur non connecté.";
      this.loading = false;
    }
  }
}
