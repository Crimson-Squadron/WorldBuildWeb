package com.worldbuild.backend.controller;

import com.worldbuild.backend.dto.FactionDto;
import com.worldbuild.backend.service.FactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/factions")
@RequiredArgsConstructor
public class FactionController {

    private final FactionService factionService;

    @GetMapping
    public ResponseEntity<List<FactionDto>> getAllFactions() {
        return ResponseEntity.ok(factionService.getAllFactions());
    }

    @PostMapping
    public ResponseEntity<FactionDto> createFaction(@Valid @RequestBody FactionDto dto) {
        FactionDto created = factionService.createFaction(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
