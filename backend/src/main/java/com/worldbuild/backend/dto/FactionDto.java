package com.worldbuild.backend.dto;

import com.worldbuild.backend.model.Faction;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FactionDto {
    private String id;

    @NotBlank(message = "Faction name is required")
    private String name;

    private String bannerColor;
    private String description;

    public static FactionDto fromEntity(Faction faction) {
        if (faction == null) return null;
        return FactionDto.builder()
                .id(faction.getId())
                .name(faction.getName())
                .bannerColor(faction.getBannerColor())
                .description(faction.getDescription())
                .build();
    }
}
