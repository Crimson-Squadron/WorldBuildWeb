package com.worldbuild.backend.service;

import com.worldbuild.backend.dto.FactionDto;
import com.worldbuild.backend.model.Faction;
import com.worldbuild.backend.repository.FactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FactionService {

    private final FactionRepository factionRepository;

    @Transactional(readOnly = true)
    public List<FactionDto> getAllFactions() {
        return factionRepository.findAllByOrderByNameAsc()
                .stream()
                .map(FactionDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public FactionDto createFaction(FactionDto dto) {
        Faction faction = Faction.builder()
                .name(dto.getName())
                .bannerColor(dto.getBannerColor() != null ? dto.getBannerColor() : "#4f46e5")
                .description(dto.getDescription())
                .build();

        Faction saved = factionRepository.save(faction);
        return FactionDto.fromEntity(saved);
    }
}
