package org.example.todoprojectmanagerbackend.controller;

import org.example.todoprojectmanagerbackend.Entities.Project;
import org.example.todoprojectmanagerbackend.Entities.Task;
import org.example.todoprojectmanagerbackend.Entities.User;
import org.example.todoprojectmanagerbackend.DTO.ProjectDTO;
import org.example.todoprojectmanagerbackend.service.ProjectService;
import org.example.todoprojectmanagerbackend.service.TaskService;
import org.example.todoprojectmanagerbackend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final UserService userService;
    private final TaskService taskService;

    public ProjectController(ProjectService projectService, UserService userService, TaskService taskService) {
        this.projectService = projectService;
        this.userService = userService;
        this.taskService = taskService;
    }

    // -------------------- GET ALL PROJECTS --------------------
    @GetMapping
    public ResponseEntity<List<ProjectDTO>> getAllProjects() {
        List<ProjectDTO> projects = projectService.getAllProjects()
                .stream()
                .map(ProjectDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(projects);
    }

    // -------------------- GET PROJECT BY ID --------------------
    @GetMapping("/{id}")
    public ResponseEntity<ProjectDTO> getProjectById(@PathVariable Long id) {
        Optional<Project> project = projectService.getProjectById(id);
        return project.map(p -> ResponseEntity.ok(ProjectDTO.fromEntity(p)))
                .orElse(ResponseEntity.notFound().build());
    }

    // -------------------- GET PROJECTS BY USER EMAIL --------------------
    @GetMapping("/user/{email}")
    public ResponseEntity<List<ProjectDTO>> getProjectsByUser(@PathVariable String email) {
        Optional<User> user = userService.getUserByEmail(email);
        if (user.isEmpty()) return ResponseEntity.notFound().build();

        List<ProjectDTO> projects = projectService.getProjectsByUser(user.get())
                .stream()
                .map(ProjectDTO::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(projects);
    }

    // -------------------- CREATE PROJECT --------------------
    @PostMapping("/user/{email}")
    public ResponseEntity<ProjectDTO> createProject(@PathVariable String email, @RequestBody Project project) {
        Optional<User> user = userService.getUserByEmail(email);
        if (user.isEmpty()) return ResponseEntity.badRequest().build();

        project.setOwner(user.get());
        Project savedProject = projectService.saveProject(project);
        return ResponseEntity.ok(ProjectDTO.fromEntity(savedProject));
    }

    // -------------------- UPDATE PROJECT --------------------
    @PutMapping("/{id}")
    public ResponseEntity<ProjectDTO> updateProject(@PathVariable Long id, @RequestBody Project updatedProject) {
        try {
            Project project = projectService.updateProject(id, updatedProject);
            return ResponseEntity.ok(ProjectDTO.fromEntity(project));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // -------------------- DELETE PROJECT --------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        // Supprimer d'abord toutes les tâches associées au projet
        taskService.deleteTasksByProjectId(id);

        // Puis supprimer le projet
        projectService.deleteProjectById(id);
        return ResponseEntity.noContent().build();
    }

    // -------------------- ADD TASK TO PROJECT --------------------
    @PostMapping("/{projectId}/tasks")
    public ResponseEntity<Task> addTaskToProject(@PathVariable Long projectId, @RequestBody Task task) {
        Optional<Project> project = projectService.getProjectById(projectId);
        if (project.isEmpty()) return ResponseEntity.notFound().build();

        task.setProject(project.get());
        Task savedTask = taskService.saveTask(task);
        return ResponseEntity.ok(savedTask);
    }

    // -------------------- GET PROJECT TASKS --------------------
    @GetMapping("/{projectId}/tasks")
    public ResponseEntity<List<Task>> getProjectTasks(@PathVariable Long projectId) {
        return ResponseEntity.ok(taskService.getTasksByProjectId(projectId));
    }
}