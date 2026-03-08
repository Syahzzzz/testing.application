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

    public Item getItemById(Long id) {
        return itemRepository.findById(id).orElse(null);
    }

    public Item createItem(Item item) {
        return itemRepository.save(item);
    }

    public Item updateItem(Long id, Item itemDetails) {
        Item item = itemRepository.findById(id).orElse(null);
        if (item != null) {
            item.setName(itemDetails.getName());
            return itemRepository.save(item);
        }
        return null;
    }

    public void deleteItem(Long id) {
        itemRepository.deleteById(id);
    }
}
