package com.worldbuild.backend.repository;

import com.worldbuild.backend.model.HistoricalEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface HistoricalEventRepository extends JpaRepository<HistoricalEvent, String>, JpaSpecificationExecutor<HistoricalEvent> {
}
