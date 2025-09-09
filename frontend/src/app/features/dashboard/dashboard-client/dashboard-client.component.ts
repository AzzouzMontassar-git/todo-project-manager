import { Component, OnInit } from '@angular/core';
import { Project, Task, User, DashboardClientService } from '../../../services/dashboard-client.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard-client',
  templateUrl: './dashboard-client.component.html',
  styleUrls: ['./dashboard-client.component.css']
})
export class DashboardClientComponent implements OnInit {
  currentUser: User | null = null;
  projects: Project[] = [];
  users: User[] = [];
  loadingProjects = true;
  loadingUsers = true;
  errorMessage = '';

  constructor(
    private dashboardClientService: DashboardClientService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();

    if (!this.currentUser || !this.currentUser.email) {
      this.errorMessage = "Vous n'êtes pas connecté ou l'email est manquant.";
      return;
    }

    // 🔹 Charger les projets
    this.dashboardClientService.getProjectsByUserEmail(this.currentUser.email)
      .subscribe({
        next: projects => {
          this.projects = projects;
          this.loadingProjects = false;
        },
        error: err => {
          console.error(err);
          this.errorMessage = "Impossible de charger les projets.";
          this.loadingProjects = false;
        }
      });

    // 🔹 Charger tous les utilisateurs
    this.dashboardClientService.getAllUsers()
      .subscribe({
        next: users => {
          this.users = users;
          this.loadingUsers = false;
        },
        error: err => {
          console.error(err);
          this.errorMessage = "Impossible de charger les utilisateurs.";
          this.loadingUsers = false;
        }
      });
  }

  addTask(project: Project, title: string) {
    if (!title.trim() || !project.id) return;

    const newTask: Task = { title, done: false };
    this.dashboardClientService.addTaskToProject(project.id, newTask)
      .subscribe(task => {
        if (!project.tasks) project.tasks = [];
        project.tasks.push(task);
      });
  }

  toggleTask(task: Task) {
    if (!task.id) return;

    // 🔹 Appel via le service pour gérer le token et le CORS
    this.dashboardClientService.toggleTaskStatus(task.id)
      .subscribe({
        next: updatedTask => task.done = updatedTask.done,
        error: err => console.error('Erreur toggle tâche :', err)
      });
  }

  getUserName(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? `${user.nom} ${user.prenom}` : 'Utilisateur inconnu';
  }

  get displayName(): string {
    if (!this.currentUser) return 'Utilisateur';
    if (this.currentUser.nom && this.currentUser.prenom) return `${this.currentUser.nom} ${this.currentUser.prenom}`;
    if (this.currentUser.nom) return this.currentUser.nom;
    return 'Utilisateur';
  }

  isProjectCompleted(project: Project): boolean {
    if (!project.tasks || project.tasks.length === 0) return false;
    return project.tasks.every(task => task.done);
  }
}
