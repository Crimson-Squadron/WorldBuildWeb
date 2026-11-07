package com.worldbuild.backend.repository;

import com.worldbuild.backend.model.Faction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FactionRepository extends JpaRepository<Faction, String> {
    List<Faction> findAllByOrderByNameAsc();
    Optional<Faction> findByNameIgnoreCase(String name);
}
