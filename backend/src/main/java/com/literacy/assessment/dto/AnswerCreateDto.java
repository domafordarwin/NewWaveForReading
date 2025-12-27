package com.literacy.assessment.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnswerCreateDto {
    private Long assessmentId;
    private String content;
    private Integer wordCount;
    private Integer charCount;
    private Integer paragraphCount;
}
