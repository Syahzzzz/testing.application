package com.first.application.testing.application.repository;


import com.first.application.testing.application.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
//Test
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    // Spring Data JPA automatically provides basic CRUD operations (save, findAll, deleteById)

    // Here is how you use a custom JPQL query to find specific data
    // Specifies a custom JPQL query to execute for this repository method
    @Query("SELECT t FROM Task t WHERE t.status = :PENDING")
    // Binds the method parameter to the query parameter named "status"
    List<Task> findTasksByStatusJPQL(@Param("status") String status);
}
