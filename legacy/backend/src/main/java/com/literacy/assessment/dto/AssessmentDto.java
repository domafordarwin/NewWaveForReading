package com.literacy.assessment.dto;

import com.literacy.assessment.entity.AssessmentStatus;
import com.literacy.assessment.entity.AssessmentType;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssessmentDto {
    private Long assessmentId;
    private Long studentId;
    private Long topicId;
    private String topicText;
    private AssessmentType assessmentType;
    private AssessmentStatus status;
    private LocalDateTime startedAt;
    private LocalDateTime submittedAt;
    private Integer timeLimitMinutes;
    private Integer wordCountMin;
    private Integer wordCountMax;
}
