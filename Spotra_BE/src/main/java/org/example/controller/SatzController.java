package org.example.controller;

import org.example.model.Satz;
import org.example.model.Trainingseinheit;
import org.example.repository.SatzRepository;
import org.example.repository.TrainingseinheitRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/saetze")
public class SatzController {
    private final SatzRepository repo;
    private final TrainingseinheitRepository einheitRepo;

    public SatzController(SatzRepository repo, TrainingseinheitRepository einheitRepo) {
        this.repo = repo;
        this.einheitRepo = einheitRepo;
    }

    @PostMapping
    public Satz create(@RequestBody Satz s) {
        if (s.getEinheit() == null || s.getEinheit().getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "einheit.id required");
        }
        Trainingseinheit t = einheitRepo.findById(s.getEinheit().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trainingseinheit not found"));
        s.setEinheit(t);
        return repo.save(s);
    }

    @PutMapping("/{id}")
    public Satz update(@PathVariable Long id, @RequestBody Satz s) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Satz not found");
        }
        s.setId(id);
        if (s.getEinheit() != null && s.getEinheit().getId() != null) {
            Trainingseinheit t = einheitRepo.findById(s.getEinheit().getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trainingseinheit not found"));
            s.setEinheit(t);
        }
        return repo.save(s);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Satz not found");
        }
        repo.deleteById(id);
    }
}
