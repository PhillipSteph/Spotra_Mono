package org.example.repository;

import org.example.model.Trainingseinheit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrainingseinheitRepository extends JpaRepository<Trainingseinheit, Long> {
    List<Trainingseinheit> findByGeraet_Id(Long geraetId);
}
