package org.example.todoprojectmanagerbackend.service.Impl;



import org.example.todoprojectmanagerbackend.Entities.Task;
import org.example.todoprojectmanagerbackend.repository.TaskRepository;
import org.example.todoprojectmanagerbackend.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;

    @Autowired
    public TaskServiceImpl(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @Override
    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    @Override
    public List<Task> getTasksByProjectId(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    @Override
    public List<Task> getTasksByStatus(boolean done) {
        return taskRepository.findByDone(done);
    }

    @Override
    public Task saveTask(Task task) {
        return taskRepository.save(task);
    }

    @Override
    public Task updateTask(Long id, Task taskDetails) {
        return taskRepository.findById(id)
                .map(existingTask -> {
                    if (taskDetails.getTitle() != null) {
                        existingTask.setTitle(taskDetails.getTitle());
                    }
                    existingTask.setDone(taskDetails.isDone());

                    if (taskDetails.getProject() != null) {
                        existingTask.setProject(taskDetails.getProject());
                    }

                    return taskRepository.save(existingTask);
                })
                .orElseThrow(() -> new RuntimeException("Tâche non trouvée avec l'id: " + id));
    }

    @Override
    public void deleteTask(Long id) {
        if (taskRepository.existsById(id)) {
            taskRepository.deleteById(id);
        } else {
            throw new RuntimeException("Tâche non trouvée avec l'id: " + id);
        }
    }

    @Override
    public void deleteTasksByProjectId(Long projectId) {
        List<Task> tasks = taskRepository.findByProjectId(projectId);
        taskRepository.deleteAll(tasks);
    }
}