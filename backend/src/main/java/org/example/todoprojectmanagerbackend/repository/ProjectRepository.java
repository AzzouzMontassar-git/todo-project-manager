package org.example.todoprojectmanagerbackend.repository;

import org.example.todoprojectmanagerbackend.Entities.Project;
import org.example.todoprojectmanagerbackend.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByOwner(User owner);
}
