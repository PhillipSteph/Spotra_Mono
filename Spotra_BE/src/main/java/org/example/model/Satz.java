package org.example.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "saetze")
public class Satz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double gewicht;
    private Integer wiederholungen;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "einheit_id")
    @JsonBackReference(value = "einheit-saetze")
    private Trainingseinheit einheit;

    public Satz() {}

    public Satz(Double gewicht, Integer wiederholungen, Trainingseinheit einheit) {
        this.gewicht = gewicht;
        this.wiederholungen = wiederholungen;
        this.einheit = einheit;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getGewicht() {
        return gewicht;
    }

    public void setGewicht(Double gewicht) {
        this.gewicht = gewicht;
    }

    public Integer getWiederholungen() {
        return wiederholungen;
    }

    public void setWiederholungen(Integer wiederholungen) {
        this.wiederholungen = wiederholungen;
    }

    public Trainingseinheit getEinheit() {
        return einheit;
    }

    public void setEinheit(Trainingseinheit einheit) {
        this.einheit = einheit;
    }
}
