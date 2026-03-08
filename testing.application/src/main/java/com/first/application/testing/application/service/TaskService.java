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
        return taskRepository.findAllByOrderByPositionAsc();
    }

    public Task createTask(Task task) {
        if (task.getPosition() == null) {
            task.setPosition(taskRepository.findMaxPosition() + 1);
        }
        return taskRepository.save(task);
    }

    public void reorderTasks(List<Long> taskIds) {
        for (int i = 0; i < taskIds.size(); i++) {
            Long id = taskIds.get(i);
            Task task = taskRepository.findById(id).orElse(null);
            if (task != null) {
                task.setPosition(i);
                taskRepository.save(task);
            }
        }
    }

    public List<Task> getTasksByStatus(String status) {
        // Utilizing the custom JPQL query we built
        return taskRepository.findTasksByStatusJPQL(status);
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id).orElse(null);
    }

    public Task updateTask(Long id, Task taskDetails) {
        Task task = taskRepository.findById(id).orElse(null);
        if (task != null) {
            task.setTitle(taskDetails.getTitle());
            task.setStatus(taskDetails.getStatus());
            task.setDueDate(taskDetails.getDueDate());
            return taskRepository.save(task);
        }
        return null;
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}
