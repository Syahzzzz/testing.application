package com.first.application.testing.application.controlller;

import com.first.application.testing.application.entity.Task;
import com.first.application.testing.application.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Combines @Controller and @ResponseBody, marking this class as a request handler that returns data directly
@RestController
// Maps all HTTP operations in this controller to the "/api/tasks" base URL
@RequestMapping("/api/tasks")
// Allows Cross-Origin Resource Sharing (CORS) from the specified React frontend URL
@CrossOrigin(origins = "http://localhost:5173") // This allows a React frontend to communicate with this API
public class TaskController {

    // Injects the TaskService dependency
    @Autowired
    private TaskService taskService;

    // Maps HTTP GET requests to this handler method
    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    // Maps HTTP POST requests to this handler method
    @PostMapping
    // Binds the HTTP request body to the Task domain object
    public Task createTask(@RequestBody Task task) {
        return taskService.createTask(task);
    }

    @PutMapping("/reorder")
    public void reorderTasks(@RequestBody List<Long> taskIds) {
        taskService.reorderTasks(taskIds);
    }

    // Maps HTTP GET requests with a dynamic "status" path variable
    @GetMapping("/status/{status}")
    // Binds the method parameter to the path variable in the URI
    public List<Task> getTasksByStatus(@PathVariable String status) {
        return taskService.getTasksByStatus(status);
    }

    // Maps HTTP GET requests for a specific task ID
    @GetMapping("/{id}")
    public Task getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id);
    }

    // Maps HTTP PUT requests for a specific task ID
    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task taskDetails) {
        return taskService.updateTask(id, taskDetails);
    }

    // Maps HTTP DELETE requests for a specific task ID
    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }
}
