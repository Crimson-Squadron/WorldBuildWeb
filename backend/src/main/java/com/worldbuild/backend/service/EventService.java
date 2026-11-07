package com.worldbuild.backend.service;

import com.worldbuild.backend.dto.ChapterDto;
import com.worldbuild.backend.dto.CreateEventRequest;
import com.worldbuild.backend.dto.EventResponse;
import com.worldbuild.backend.model.EventChapter;
import com.worldbuild.backend.model.Faction;
import com.worldbuild.backend.model.HistoricalEvent;
import com.worldbuild.backend.model.Location;
import com.worldbuild.backend.repository.EventSpecification;
import com.worldbuild.backend.repository.FactionRepository;
import com.worldbuild.backend.repository.HistoricalEventRepository;
import com.worldbuild.backend.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final HistoricalEventRepository eventRepository;
    private final LocationRepository locationRepository;
    private final FactionRepository factionRepository;

    @Transactional(readOnly = true)
    public List<EventResponse> searchEvents(
            String search,
            String locationId,
            List<String> factionIds,
            LocalDate fromDate,
            LocalDate toDate,
            String sortBy,
            String sortDirection
    ) {
        // Default sort configuration
        String sortProperty = "eventDate";
        if ("title".equalsIgnoreCase(sortBy)) {
            sortProperty = "title";
        } else if ("createdAt".equalsIgnoreCase(sortBy)) {
            sortProperty = "createdAt";
        }

        Sort.Direction direction = "asc".equalsIgnoreCase(sortDirection) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Sort sort = Sort.by(direction, sortProperty);

        Specification<HistoricalEvent> spec = EventSpecification.filter(
                search, locationId, factionIds, fromDate, toDate
        );

        List<HistoricalEvent> events = eventRepository.findAll(spec, sort);
        return events.stream().map(EventResponse::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EventResponse getEventById(String id) {
        HistoricalEvent event = eventRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Historical event not found with ID: " + id));
        return EventResponse.fromEntity(event);
    }

    @Transactional
    public EventResponse createEvent(CreateEventRequest request) {
        Location location = null;
        if (request.getLocationId() != null && !request.getLocationId().isBlank()) {
            location = locationRepository.findById(request.getLocationId()).orElse(null);
        }

        Set<Faction> factions = new HashSet<>();
        if (request.getFactionIds() != null && !request.getFactionIds().isEmpty()) {
            factions.addAll(factionRepository.findAllById(request.getFactionIds()));
        }

        HistoricalEvent event = HistoricalEvent.builder()
                .title(request.getTitle())
                .synopsis(request.getSynopsis())
                .imageUrl(request.getImageUrl())
                .eventDate(request.getEventDate())
                .location(location)
                .factions(factions)
                .build();

        // Build chapters with 1-based order index
        List<EventChapter> chapters = new ArrayList<>();
        if (request.getChapters() != null) {
            int index = 1;
            for (ChapterDto chapterDto : request.getChapters()) {
                EventChapter chapter = EventChapter.builder()
                        .event(event)
                        .orderIndex(chapterDto.getOrderIndex() != null ? chapterDto.getOrderIndex() : index++)
                        .chapterTitle(chapterDto.getChapterTitle())
                        .imageUrl(chapterDto.getImageUrl())
                        .content(chapterDto.getContent())
                        .build();
                chapters.add(chapter);
            }
        }
        event.setChapters(chapters);

        HistoricalEvent saved = eventRepository.save(event);
        return EventResponse.fromEntity(saved);
    }

    @Transactional
    public EventResponse updateEvent(String id, CreateEventRequest request) {
        HistoricalEvent event = eventRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Historical event not found with ID: " + id));

        event.setTitle(request.getTitle());
        event.setSynopsis(request.getSynopsis());
        event.setImageUrl(request.getImageUrl());
        event.setEventDate(request.getEventDate());

        if (request.getLocationId() != null && !request.getLocationId().isBlank()) {
            Location location = locationRepository.findById(request.getLocationId()).orElse(null);
            event.setLocation(location);
        } else {
            event.setLocation(null);
        }

        Set<Faction> factions = new HashSet<>();
        if (request.getFactionIds() != null && !request.getFactionIds().isEmpty()) {
            factions.addAll(factionRepository.findAllById(request.getFactionIds()));
        }
        event.setFactions(factions);

        // Replace chapters
        event.getChapters().clear();
        if (request.getChapters() != null) {
            int index = 1;
            for (ChapterDto chapterDto : request.getChapters()) {
                EventChapter chapter = EventChapter.builder()
                        .event(event)
                        .orderIndex(chapterDto.getOrderIndex() != null ? chapterDto.getOrderIndex() : index++)
                        .chapterTitle(chapterDto.getChapterTitle())
                        .imageUrl(chapterDto.getImageUrl())
                        .content(chapterDto.getContent())
                        .build();
                event.getChapters().add(chapter);
            }
        }

        HistoricalEvent updated = eventRepository.save(event);
        return EventResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteEvent(String id) {
        if (!eventRepository.existsById(id)) {
            throw new NoSuchElementException("Historical event not found with ID: " + id);
        }
        eventRepository.deleteById(id);
    }
}
