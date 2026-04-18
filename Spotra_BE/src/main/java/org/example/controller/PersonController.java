package org.example.controller;

import org.example.model.Person;
import org.example.repository.PersonRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/persons")
public class PersonController {
    private final PersonRepository repo;

    public PersonController(PersonRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Person> all() {
        return repo.findAll();
    }

    @PostMapping
    public Person create(@RequestBody Person p) {
        return repo.save(p);
    }

    @GetMapping("/{id}")
    public Person get(@PathVariable Long id) {
        return repo.findById(id).orElseThrow();
    }

    @PutMapping("/{id}")
    public Person update(@PathVariable Long id, @RequestBody Person p) {
        p.setId(id);
        return repo.save(p);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
