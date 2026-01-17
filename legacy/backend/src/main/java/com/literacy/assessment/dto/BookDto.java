package com.literacy.assessment.dto;

import com.literacy.assessment.entity.DifficultyLevel;
import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookDto {
    private Long bookId;
    private String title;
    private String author;
    private String publisher;
    private Integer publishedYear;
    private String isbn;
    private String category;
    private String description;
    private String coverImageUrl;
    private DifficultyLevel difficultyLevel;
}
