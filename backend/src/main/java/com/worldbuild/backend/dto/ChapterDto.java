package com.worldbuild.backend.dto;

import com.worldbuild.backend.model.EventChapter;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChapterDto {
    private String id;
    private Integer orderIndex;

    @NotBlank(message = "Chapter title is required")
    private String chapterTitle;

    private String imageUrl;
    private String imageCaption;

    @NotBlank(message = "Chapter content is required")
    private String content;

    public static ChapterDto fromEntity(EventChapter chapter) {
        if (chapter == null) return null;
        return ChapterDto.builder()
                .id(chapter.getId())
                .orderIndex(chapter.getOrderIndex())
                .chapterTitle(chapter.getChapterTitle())
                .imageUrl(chapter.getImageUrl())
                .imageCaption(chapter.getImageCaption())
                .content(chapter.getContent())
                .build();
    }
}
