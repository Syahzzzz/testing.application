package com.first.application.testing.application.service;
import com.first.application.testing.application.entity.Item;
import com.first.application.testing.application.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

// Indicates that this class provides business services
@Service
public class ItemService {

    // Automatically injects the ItemRepository dependency
    @Autowired
    private ItemRepository itemRepository;

    public List<Item> getAllItems() {
        // Fetches all records from your PostgreSQL table
        return itemRepository.findAll();
    }
}
