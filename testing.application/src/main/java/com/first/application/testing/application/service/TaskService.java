package com.first.application.testing.application.service;

import com.first.application.testing.application.entity.Task;
import com.first.application.testing.application.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

// Marks this class as a Spring Service, a type of component that holds business logic
@Service
public class TaskService {

    // Injects the TaskRepository dependency automatically by Spring
    @Autowired
    private TaskRepository taskRepository;

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    public List<Task> getTasksByStatus(String status) {
        // Utilizing the custom JPQL query we built
        return taskRepository.findTasksByStatusJPQL(status);
    }
}
