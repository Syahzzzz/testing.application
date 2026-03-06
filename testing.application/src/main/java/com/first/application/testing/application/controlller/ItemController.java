package com.first.application.testing.application.controlller;

import com.first.application.testing.application.entity.Item;
import com.first.application.testing.application.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/items") // The base URL for this controller
public class ItemController {

    @Autowired
    private ItemService itemService;

    @GetMapping
    public List<Item> getAllItems() {
        // When your React app hits GET /api/items, this runs!
        return itemService.getAllItems();
    }
}