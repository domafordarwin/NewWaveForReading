package com.literacy.assessment.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvaluationDto {
    private Long evaluationId;
    private Long answerId;
    private Long assessmentId;
    private Long studentId;
    private Integer bookAnalysisScore;
    private Integer creativeThinkingScore;
    private Integer problemSolvingScore;
    private Integer expressionScore;
    private Integer totalScore;
    private String grade;
    private Integer spellingErrors;
    private Integer spacingErrors;
    private Integer grammarErrors;
    private String comprehensiveFeedback;
    private String detailedFeedback;
    private String strengths;
    private String weaknesses;
    private String improvements;
}
