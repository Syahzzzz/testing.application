package com.first.application.testing.application.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

// Specifies that this class is a JPA entity and maps to a database table
@Entity
public class Item {

    // Marks this field as the primary key of the entity
    @Id
    // Specifies that the primary key generation relies on an identity database column
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    // You will need Getters and Setters here
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}