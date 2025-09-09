package org.example.todoprojectmanagerbackend.Entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private boolean done;

    @ManyToOne
    @JoinColumn(name = "project_id")
    @JsonBackReference // Evite la boucle infinie Project → Task → Project
    private Project project;

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public boolean isDone() { return done; }
    public void setDone(boolean done) { this.done = done; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }
}
