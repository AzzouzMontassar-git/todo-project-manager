package org.example.todoprojectmanagerbackend.DTO;

import org.example.todoprojectmanagerbackend.Entities.Task;

import java.util.List;
import java.util.stream.Collectors;

public class ProjectDTO {
    private Long id;
    private String title;
    private String description;
    private List<Long> assignedTo; // IDs des utilisateurs
    private List<Task> tasks;

    public ProjectDTO() {}

    public ProjectDTO(Long id, String title, String description, List<Long> assignedTo, List<Task> tasks) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.assignedTo = assignedTo;
        this.tasks = tasks;
    }

    public static ProjectDTO fromEntity(org.example.todoprojectmanagerbackend.Entities.Project project) {
        List<Long> userIds = project.getOwner() != null
                ? List.of(project.getOwner().getId())
                : List.of();
        return new ProjectDTO(
                project.getId(),
                project.getTitle(),
                project.getDescription(),
                userIds,
                project.getTasks()
        );
    }

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<Long> getAssignedTo() { return assignedTo; }
    public void setAssignedTo(List<Long> assignedTo) { this.assignedTo = assignedTo; }

    public List<Task> getTasks() { return tasks; }
    public void setTasks(List<Task> tasks) { this.tasks = tasks; }
}