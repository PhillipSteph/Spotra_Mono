package org.example.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sportgeraete")
public class Sportgeraet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String beschreibung;

    @OneToMany(mappedBy = "geraet", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference(value = "geraet-einheiten")
    private List<Trainingseinheit> einheiten = new ArrayList<>();

    public Sportgeraet() {}

    public Sportgeraet(String name, String beschreibung) {
        this.name = name;
        this.beschreibung = beschreibung;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBeschreibung() {
        return beschreibung;
    }

    public void setBeschreibung(String beschreibung) {
        this.beschreibung = beschreibung;
    }

    public List<Trainingseinheit> getEinheiten() {
        return einheiten;
    }

    public void setEinheiten(List<Trainingseinheit> einheiten) {
        this.einheiten = einheiten;
    }
}
