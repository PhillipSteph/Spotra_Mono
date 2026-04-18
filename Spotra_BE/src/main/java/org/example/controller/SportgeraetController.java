package org.example.controller;

import org.example.model.Sportgeraet;
import org.example.repository.SportgeraetRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/geraete")
public class SportgeraetController {
    private final SportgeraetRepository repo;

    public SportgeraetController(SportgeraetRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Sportgeraet> all() {
        return repo.findAll();
    }

    @PostMapping
    public Sportgeraet create(@RequestBody Sportgeraet g) {
        return repo.save(g);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Sportgeraet not found");
        }
        repo.deleteById(id);
    }
}
