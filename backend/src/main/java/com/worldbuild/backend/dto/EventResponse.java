package com.worldbuild.backend.dto;

import com.worldbuild.backend.model.HistoricalEvent;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventResponse {
    private String id;
    private String title;
    private String synopsis;
    private String imageUrl;
    private LocalDate eventDate;
    private LocationDto location;
    private List<FactionDto> factions;
    private List<ChapterDto> chapters;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static EventResponse fromEntity(HistoricalEvent event) {
        if (event == null) return null;
        return EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .synopsis(event.getSynopsis())
                .imageUrl(event.getImageUrl())
                .eventDate(event.getEventDate())
                .location(LocationDto.fromEntity(event.getLocation()))
                .factions(event.getFactions() != null ?
                        event.getFactions().stream().map(FactionDto::fromEntity).collect(Collectors.toList()) :
                        Collections.emptyList())
                .chapters(event.getChapters() != null ?
                        event.getChapters().stream().map(ChapterDto::fromEntity).collect(Collectors.toList()) :
                        Collections.emptyList())
                .createdAt(event.getCreatedAt())
                .updatedAt(event.getUpdatedAt())
                .build();
    }
}
