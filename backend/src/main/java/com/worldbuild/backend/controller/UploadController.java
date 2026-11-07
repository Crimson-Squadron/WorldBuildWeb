package com.worldbuild.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    // Target upload destination in frontend/public/uploads so Next.js serves it directly
    private final Path uploadLocation = Paths.get("../frontend/public/uploads").toAbsolutePath().normalize();

    public UploadController() {
        try {
            Files.createDirectories(uploadLocation);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
        }

        if (!Arrays.asList(".png", ".jpg", ".jpeg", ".webp", ".gif").contains(extension)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Unsupported image format. Allowed: PNG, JPG, WEBP, GIF"));
        }

        String generatedFilename = UUID.randomUUID() + extension;
        Path targetPath = uploadLocation.resolve(generatedFilename);

        try {
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            Map<String, String> response = new HashMap<>();
            response.put("url", "/uploads/" + generatedFilename);
            response.put("filename", generatedFilename);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to store image: " + e.getMessage()));
        }
    }
}
