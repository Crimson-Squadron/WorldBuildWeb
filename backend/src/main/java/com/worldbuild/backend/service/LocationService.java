package com.worldbuild.backend.service;

import com.worldbuild.backend.dto.LocationDto;
import com.worldbuild.backend.model.Location;
import com.worldbuild.backend.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LocationService {

    private final LocationRepository locationRepository;

    @Transactional(readOnly = true)
    public List<LocationDto> getAllLocations() {
        return locationRepository.findAllByOrderByNameAsc()
                .stream()
                .map(LocationDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public LocationDto createLocation(LocationDto dto) {
        Location parent = null;
        if (dto.getParentLocationId() != null && !dto.getParentLocationId().isBlank()) {
            parent = locationRepository.findById(dto.getParentLocationId()).orElse(null);
        }

        Location location = Location.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .mapX(dto.getMapX())
                .mapY(dto.getMapY())
                .parentLocation(parent)
                .build();

        Location saved = locationRepository.save(location);
        return LocationDto.fromEntity(saved);
    }
}
