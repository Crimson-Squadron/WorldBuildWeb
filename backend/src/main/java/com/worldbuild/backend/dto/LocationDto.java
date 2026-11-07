package com.worldbuild.backend.dto;

import com.worldbuild.backend.model.Location;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LocationDto {
    private String id;

    @NotBlank(message = "Location name is required")
    private String name;

    private String description;
    private Double mapX;
    private Double mapY;
    private String parentLocationId;

    public static LocationDto fromEntity(Location location) {
        if (location == null) return null;
        return LocationDto.builder()
                .id(location.getId())
                .name(location.getName())
                .description(location.getDescription())
                .mapX(location.getMapX())
                .mapY(location.getMapY())
                .parentLocationId(location.getParentLocation() != null ? location.getParentLocation().getId() : null)
                .build();
    }
}
