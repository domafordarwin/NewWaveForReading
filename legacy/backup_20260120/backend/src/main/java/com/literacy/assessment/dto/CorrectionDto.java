package com.literacy.assessment.dto;

import com.literacy.assessment.entity.CorrectionType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CorrectionDto {
    private Long correctionId;
    private Long evaluationId;
    private CorrectionType correctionType;
    private Integer startPosition;
    private Integer endPosition;
    private String originalText;
    private String correctedText;
    private String description;
    private Integer severity;
}
