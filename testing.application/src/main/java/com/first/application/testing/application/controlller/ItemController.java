package com.first.application.testing.application.controlller;

import com.first.application.testing.application.entity.Item;
import com.first.application.testing.application.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

// Marks this class as a RESTful web service controller
@RestController
// Sets the base URL path for all endpoints in this controller
@RequestMapping("/api/items") // The base URL for this controller
public class ItemController {

    // Automatically injects the ItemService bean
    @Autowired
    private ItemService itemService;

    // Handles incoming HTTP GET requests for the base URL
    @GetMapping
    public List<Item> getAllItems() {
        // When your React app hits GET /api/items, this runs!
        return itemService.getAllItems();
    }

    @GetMapping("/{id}")
    public Item getItemById(@PathVariable Long id) {
        return itemService.getItemById(id);
    }

    @PostMapping
    public Item createItem(@RequestBody Item item) {
        return itemService.createItem(item);
    }

    @PutMapping("/{id}")
    public Item updateItem(@PathVariable Long id, @RequestBody Item itemDetails) {
        return itemService.updateItem(id, itemDetails);
    }

    @DeleteMapping("/{id}")
    public void deleteItem(@PathVariable Long id) {
        itemService.deleteItem(id);
    }
}