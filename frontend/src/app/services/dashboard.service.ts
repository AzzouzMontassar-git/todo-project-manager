import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Task {
  id?: number;
  title: string;
  done: boolean;
  projectId?: number; // Ajouté pour lier la tâche à un projet
}

export interface Project {
  id?: number;
  title: string;
  description: string;
  assignedTo: number[]; // IDs des utilisateurs assignés
  tasks: Task[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiProjects = `${environment.API_URL}/projects`;
  private apiTasks = `${environment.API_URL}/tasks`;

  constructor(private http: HttpClient) {}

  // Méthodes pour les projets
  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiProjects);
  }

  getProjectsByUser(email: string): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiProjects}/user/${email}`);
  }

  createProject(email: string, project: Project): Observable<Project> {
    return this.http.post<Project>(`${this.apiProjects}/user/${email}`, project);
  }

  updateProject(projectId: number, project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.apiProjects}/${projectId}`, project);
  }

  deleteProject(projectId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiProjects}/${projectId}`);
  }

  // Méthodes pour les tâches
  getProjectTasks(projectId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiProjects}/${projectId}/tasks`);
  }

  addTaskToProject(projectId: number, task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.apiProjects}/${projectId}/tasks`, task);
  }

  updateTask(taskId: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiTasks}/${taskId}`, task);
  }

  deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiTasks}/${taskId}`);
  }

  toggleTaskStatus(taskId: number): Observable<Task> {
    return this.http.patch<Task>(`${this.apiTasks}/${taskId}/toggle`, {});
  }
}