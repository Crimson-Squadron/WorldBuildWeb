package com.worldbuild.backend.repository;

import com.worldbuild.backend.model.Faction;
import com.worldbuild.backend.model.HistoricalEvent;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class EventSpecification {

    public static Specification<HistoricalEvent> filter(
            String search,
            String locationId,
            List<String> factionIds,
            LocalDate fromDate,
            LocalDate toDate
    ) {
        return (root, query, cb) -> {
            query.distinct(true);
            List<Predicate> predicates = new ArrayList<>();

            // 1. Search in Title
            if (search != null && !search.trim().isEmpty()) {
                String searchPattern = "%" + search.trim().toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("title")), searchPattern));
            }

            // 2. Filter by Location
            if (locationId != null && !locationId.trim().isEmpty()) {
                predicates.add(cb.equal(root.get("location").get("id"), locationId.trim()));
            }

            // 3. Filter by Factions
            if (factionIds != null && !factionIds.isEmpty()) {
                Join<HistoricalEvent, Faction> factionJoin = root.join("factions");
                predicates.add(factionJoin.get("id").in(factionIds));
            }

            // 4. Date range filters
            if (fromDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("eventDate"), fromDate));
            }
            if (toDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("eventDate"), toDate));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
