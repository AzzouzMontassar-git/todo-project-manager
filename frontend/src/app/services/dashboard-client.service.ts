import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
  id?: number;
  title: string;
  done: boolean;
}
export interface Project {
  id?: number;
  name: string;
  description: string;
  assignedTo: number[];
  tasks: Task[];
}
export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardClientService {
  private apiUrl = 'http://localhost:8080/api/projects';

  constructor(private http: HttpClient) {}

  getProjectsByUserEmail(email: string): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/user/${email}`);
  }

  addTaskToProject(projectId: number, task: { title: string; done: boolean }): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/${projectId}/tasks`, task);
  }

  toggleTaskStatus(taskId: number): Observable<Task> {
  const token = localStorage.getItem('authToken');
  return this.http.patch<Task>(`http://localhost:8080/api/tasks/${taskId}/toggle`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
}


  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:8080/api/users');
  }
}
