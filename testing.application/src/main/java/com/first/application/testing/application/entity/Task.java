package com.first.application.testing.application.entity;

import jakarta.persistence.*;

// Indicates that this class is a JPA entity mapped to a database table
@Entity
// Specifies the exact name of the database table for this entity
@Table(name = "tasks")
public class Task {

    // Denotes the primary key of the entity
    @Id
    // Configures auto-increment for the primary key column
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
