package com.first.application.testing.application.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String status;

    // Constructors
    public Task() {}

    public Task(String title, String status) {
        this.title = title;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTitle() {
        return title;
    }

    public String getStatus() {
        return status;
    }
// Getters and Setters (omitted for brevity, but you must generate them)
}
