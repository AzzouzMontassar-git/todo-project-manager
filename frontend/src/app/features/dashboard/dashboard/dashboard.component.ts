import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { DashboardService, Project, Task } from '../../../services/dashboard.service';
import { UserService, User } from '../../../services/user.service';
import { Subject, forkJoin } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @ViewChild('userSearchInput') userSearchInput!: ElementRef;

  currentUser: User = { id: 1, nom: 'Admin', prenom: 'Admin', email: 'admin@example.com', role: 'admin' };

  users: User[] = [];
  projects: Project[] = [];

  newProjectTitle = '';
  newProjectDescription = '';
  assignedUserId: number | null = null;
  assignedUser: User | null = null;
  newProjectTitleError = false;
  newProjectDescriptionError = false;
  userSearchTerm = '';

  filteredUsers: User[] = [];
  showUserSuggestions = false;

  searchTerm$ = new Subject<string>();

  constructor(
    private dashboardService: DashboardService,
    private userService: UserService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.searchTerm$.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => this.onUserSearchTerm(term));
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users.filter(u => u.role !== 'admin');
        this.loadProjects();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des utilisateurs:', error);
      }
    });
  }

  loadProjects() {
    if (this.currentUser.role === 'admin') {
      this.dashboardService.getAllProjects().subscribe({
        next: (projects) => {
          this.projects = projects || [];
          this.loadTasksForAllProjects();
        },
        error: (error) => {
          this.projects = [];
          this.cd.detectChanges();
        }
      });
    } else {
      this.dashboardService.getProjectsByUser(this.currentUser.email).subscribe({
        next: (projects) => {
          this.projects = projects || [];
          this.loadTasksForAllProjects();
        },
        error: (error) => {
          this.projects = [];
          this.cd.detectChanges();
        }
      });
    }
  }

  loadTasksForAllProjects() {
    const taskObservables = this.projects.map(project => 
      this.dashboardService.getProjectTasks(project.id || 0)
    );

    if (taskObservables.length > 0) {
      forkJoin(taskObservables).subscribe({
        next: (tasksArrays) => {
          tasksArrays.forEach((tasks, index) => {
            this.projects[index].tasks = tasks;
          });
          this.cd.detectChanges();
        },
        error: (error) => {
          this.cd.detectChanges();
        }
      });
    } else {
      this.cd.detectChanges();
    }
  }

  isFormValid(): boolean {
    return !!this.newProjectTitle.trim() && 
           !!this.newProjectDescription.trim() && 
           this.assignedUserId !== null;
  }

  validateForm() {
    this.newProjectTitleError = !this.newProjectTitle.trim();
    this.newProjectDescriptionError = !this.newProjectDescription.trim();
  }

  addProject() {
    this.validateForm();
    if (this.currentUser.role !== 'admin' || !this.isFormValid()) return;

    const project: Project = {
      title: this.newProjectTitle.trim(),
      description: this.newProjectDescription.trim(),
      assignedTo: this.assignedUserId ? [this.assignedUserId] : [],
      tasks: []
    };

    const user = this.users.find(u => u.id === this.assignedUserId);
    
    if (user) {
      this.dashboardService.createProject(user.email, project).subscribe({
        next: (savedProject) => {
          this.projects.push(savedProject);
          this.cd.detectChanges();
          this.resetForm();
        },
        error: (error) => {
          console.error('Erreur lors de la création du projet:', error);
        }
      });
    }
  }

  resetForm() {
    this.newProjectTitle = '';
    this.newProjectDescription = '';
    this.assignedUserId = null;
    this.assignedUser = null;
    this.userSearchTerm = '';
    this.newProjectTitleError = false;
    this.newProjectDescriptionError = false;
  }

  onUserSearchInput(event: Event) {
    const term = (event.target as HTMLInputElement).value || '';
    this.userSearchTerm = term;
    if (term.length > 0) {
      this.filteredUsers = this.users.filter(u =>
        u.nom.toLowerCase().includes(term.toLowerCase()) ||
        u.prenom.toLowerCase().includes(term.toLowerCase()) ||
        u.email.toLowerCase().includes(term.toLowerCase())
      );
      this.showUserSuggestions = this.filteredUsers.length > 0;
    } else {
      this.filteredUsers = [];
      this.showUserSuggestions = false;
    }
    // Reset selection if input changes
    this.assignedUserId = null;
    this.assignedUser = null;
  }

  selectUser(user: User) {
    this.assignedUserId = user.id ?? null;
    this.assignedUser = user;
    this.userSearchTerm = `${user.nom} ${user.prenom} (${user.email})`;
    this.showUserSuggestions = false;
    this.filteredUsers = [];
  }

  onUserSearchTerm(term: string) {
    // Recherche directe d'un utilisateur par email ou nom complet
    const found = this.users.find(u =>
      u.email.toLowerCase() === term.toLowerCase() ||
      (`${u.nom} ${u.prenom}`.toLowerCase() === term.toLowerCase())
    );

    if (found && typeof found.id === 'number') {
      this.assignedUserId = found.id;
      this.assignedUser = found;
    } else {
      this.assignedUserId = null;
      this.assignedUser = null;
    }
  }

  addTask(project: Project, taskTitle: string) {
    if (!taskTitle || !taskTitle.trim()) return;

    const task: Task = { 
      title: taskTitle.trim(), 
      done: false
    };

    if (project.id) {
      this.dashboardService.addTaskToProject(project.id, task).subscribe({
        next: (savedTask) => {
          if (!project.tasks) project.tasks = [];
          project.tasks.push(savedTask);
          this.cd.detectChanges();
        }
      });
    }
  }

  toggleTask(task: Task, project: Project) {
    const originalStatus = task.done;
    task.done = !task.done;
    
    if (task.id) {
      this.dashboardService.toggleTaskStatus(task.id).subscribe({
        next: (updatedTask) => {
          const index = project.tasks.findIndex(t => t.id === task.id);
          if (index !== -1) {
            project.tasks[index] = updatedTask;
          }
        },
        error: () => {
          task.done = originalStatus;
          this.cd.detectChanges();
        }
      });
    }
  }

  removeTask(project: Project, task: Task) {
    if (task.id) {
      this.dashboardService.deleteTask(task.id).subscribe({
        next: () => {
          project.tasks = project.tasks.filter(t => t.id !== task.id);
          this.cd.detectChanges();
        }
      });
    }
  }

  removeProject(project: Project) {
    if (!project.id) return;
    
    this.dashboardService.deleteProject(project.id).subscribe({
      next: () => {
        this.projects = this.projects.filter(p => p.id !== project.id);
        this.cd.detectChanges();
      }
    });
  }

  getAssignedUserNames(project: Project): string {
    if (!project.assignedTo || project.assignedTo.length === 0) return 'Non assigné';
    
    return project.assignedTo
      .map(id => {
        const user = this.users.find(u => u.id === id);
        return user ? `${user.nom} ${user.prenom} (${user.email})` : '';
      })
      .filter(Boolean)
      .join(', ');
  }

  get visibleProjects(): Project[] {
    if (this.currentUser.role === 'admin') {
      return this.projects;
    }
    return this.projects.filter(p => p.assignedTo && p.assignedTo.includes(this.currentUser.id!));
  }

  get hasFormErrors(): boolean {
    return this.newProjectTitleError || this.newProjectDescriptionError;
  }

  trackByProjectId(index: number, project: Project): any {
    return project.id || index;
  }

  trackByTaskId(index: number, task: Task): any {
    return task.id || index;
  }

  trackByUserId(index: number, user: User): any {
    return user.id || index;
  }

  onTaskInputKeyPress(event: KeyboardEvent, project: Project, input: HTMLInputElement) {
    if (event.key === 'Enter' && input.value.trim()) {
      this.addTask(project, input.value);
      input.value = '';
    }
  }
}