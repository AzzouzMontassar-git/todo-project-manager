import { Component, OnInit } from '@angular/core';

interface Project {
  id: number;
  title: string;
  description?: string;
}

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {

  projects: Project[] = []; // <-- ajout de la propriété

  constructor() { }

  ngOnInit(): void {
    // Exemple : quelques projets fictifs
    this.projects = [
      { id: 1, title: 'Projet A', description: 'Description du projet A' },
      { id: 2, title: 'Projet B', description: 'Description du projet B' },
      { id: 3, title: 'Projet C', description: 'Description du projet C' },
    ];
  }

}
