package com.worldbuild.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateEventRequest {

    @NotBlank(message = "Event title is required")
    private String title;

    private String synopsis;

    private String imageUrl;

    @NotNull(message = "Event date is required")
    private LocalDate eventDate;

    private String locationId;

    private List<String> factionIds;

    @NotEmpty(message = "At least one chapter segment is required")
    @Valid
    private List<ChapterDto> chapters;
}
