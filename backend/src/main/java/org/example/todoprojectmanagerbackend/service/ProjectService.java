package org.example.todoprojectmanagerbackend.service;

import org.example.todoprojectmanagerbackend.Entities.Project;
import org.example.todoprojectmanagerbackend.Entities.User;

import java.util.List;
import java.util.Optional;

public interface ProjectService {

    List<Project> getAllProjects();

    Optional<Project> getProjectById(Long id);

    List<Project> getProjectsByUser(User user);

    Project saveProject(Project project);

    Project updateProject(Long id, Project updatedProject);

    void deleteProjectById(Long id);
}
