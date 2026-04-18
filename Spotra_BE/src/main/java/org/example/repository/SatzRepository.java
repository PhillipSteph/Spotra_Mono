package org.example.repository;

import org.example.model.Satz;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SatzRepository extends JpaRepository<Satz, Long> {
}
