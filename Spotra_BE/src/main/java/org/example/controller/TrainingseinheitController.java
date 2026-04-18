package org.example.controller;

import org.example.model.Sportgeraet;
import org.example.model.Trainingseinheit;
import org.example.repository.SportgeraetRepository;
import org.example.repository.TrainingseinheitRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
public class TrainingseinheitController {
    private final TrainingseinheitRepository einheitRepo;
    private final SportgeraetRepository geraetRepo;

    public TrainingseinheitController(TrainingseinheitRepository einheitRepo, SportgeraetRepository geraetRepo) {
        this.einheitRepo = einheitRepo;
        this.geraetRepo = geraetRepo;
    }

    @GetMapping("/api/einheiten")
    public List<Trainingseinheit> all() {
        return einheitRepo.findAll();
    }

    @PostMapping("/api/einheiten")
    public Trainingseinheit create(@RequestBody Trainingseinheit t) {
        if (t.getGeraet() == null || t.getGeraet().getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "geraet.id required");
        }
        Sportgeraet g = geraetRepo.findById(t.getGeraet().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sportgeraet not found"));
        t.setGeraet(g);
        return einheitRepo.save(t);
    }

    @GetMapping("/api/geraete/{id}/einheiten")
    public List<Trainingseinheit> byGeraet(@PathVariable Long id) {
        if (!geraetRepo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Sportgeraet not found");
        }
        return einheitRepo.findByGeraet_Id(id);
    }
}
