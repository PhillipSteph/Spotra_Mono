package org.example.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "trainingseinheiten")
public class Trainingseinheit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime datum;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "geraet_id")
    @JsonBackReference(value = "geraet-einheiten")
    private Sportgeraet geraet;

    @OneToMany(mappedBy = "einheit", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference(value = "einheit-saetze")
    private List<Satz> saetze = new ArrayList<>();

    public Trainingseinheit() {}

    public Trainingseinheit(LocalDateTime datum, Sportgeraet geraet) {
        this.datum = datum;
        this.geraet = geraet;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getDatum() {
        return datum;
    }

    public void setDatum(LocalDateTime datum) {
        this.datum = datum;
    }

    public Sportgeraet getGeraet() {
        return geraet;
    }

    public void setGeraet(Sportgeraet geraet) {
        this.geraet = geraet;
    }

    public List<Satz> getSaetze() {
        return saetze;
    }

    public void setSaetze(List<Satz> saetze) {
        this.saetze = saetze;
    }
}
