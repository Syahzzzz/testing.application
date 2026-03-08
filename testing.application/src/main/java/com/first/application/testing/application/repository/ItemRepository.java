package com.first.application.testing.application.repository;

import com.first.application.testing.application.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// Marks this interface as a Spring Data Repository, enabling exception translation and bean discovery
@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
}