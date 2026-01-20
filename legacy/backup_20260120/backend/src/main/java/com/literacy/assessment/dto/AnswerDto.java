package com.literacy.assessment.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnswerDto {
    private Long answerId;
    private Long assessmentId;
    private String content;
    private Integer wordCount;
    private Integer charCount;
    private Integer paragraphCount;
    private LocalDateTime autoSavedAt;
    private LocalDateTime submittedAt;
    private Integer version;
}
