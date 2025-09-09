package org.example.todoprojectmanagerbackend.service;

import org.example.todoprojectmanagerbackend.Entities.Task;
import java.util.List;
import java.util.Optional;

public interface TaskService {
    List<Task> getAllTasks();
    Optional<Task> getTaskById(Long id);
    List<Task> getTasksByProjectId(Long projectId);
    List<Task> getTasksByStatus(boolean done);
    Task saveTask(Task task);
    Task updateTask(Long id, Task taskDetails);
    void deleteTask(Long id);
    void deleteTasksByProjectId(Long projectId);
}