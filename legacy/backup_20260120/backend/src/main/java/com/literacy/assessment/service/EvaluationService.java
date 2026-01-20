package com.literacy.assessment.service;

import com.literacy.assessment.dto.EvaluationDto;
import com.literacy.assessment.entity.Evaluation;
import com.literacy.assessment.repository.EvaluationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EvaluationService {

    private final EvaluationRepository evaluationRepository;

    public List<EvaluationDto> getAllEvaluations() {
        return evaluationRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public EvaluationDto getEvaluationById(Long evaluationId) {
        Evaluation evaluation = evaluationRepository.findById(evaluationId)
                .orElseThrow(() -> new RuntimeException("Evaluation not found: " + evaluationId));
        return convertToDto(evaluation);
    }

    public EvaluationDto getEvaluationByAnswerId(Long answerId) {
        Evaluation evaluation = evaluationRepository.findByAnswerId(answerId)
                .orElseThrow(() -> new RuntimeException("Evaluation not found for answer: " + answerId));
        return convertToDto(evaluation);
    }

    public List<EvaluationDto> getEvaluationsByStudentId(Long studentId) {
        return evaluationRepository.findByAnswer_Assessment_Student_Id(studentId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private EvaluationDto convertToDto(Evaluation evaluation) {
        Long answerId = evaluation.getAnswer() != null ? evaluation.getAnswer().getId() : null;
        Long assessmentId = null;
        Long studentId = null;
        if (evaluation.getAnswer() != null && evaluation.getAnswer().getAssessment() != null) {
            assessmentId = evaluation.getAnswer().getAssessment().getId();
            if (evaluation.getAnswer().getAssessment().getStudent() != null) {
                studentId = evaluation.getAnswer().getAssessment().getStudent().getId();
            }
        }
        return EvaluationDto.builder()
                .evaluationId(evaluation.getId())
                .answerId(answerId)
                .assessmentId(assessmentId)
                .studentId(studentId)
                .bookAnalysisScore(evaluation.getBookAnalysisScore())
                .creativeThinkingScore(evaluation.getCreativeThinkingScore())
                .problemSolvingScore(evaluation.getProblemSolvingScore())
                .expressionScore(evaluation.getExpressionScore())
                .totalScore(evaluation.getTotalScore())
                .grade(evaluation.getGrade())
                .spellingErrors(evaluation.getSpellingErrors())
                .spacingErrors(evaluation.getSpacingErrors())
                .grammarErrors(evaluation.getGrammarErrors())
                .comprehensiveFeedback(evaluation.getComprehensiveFeedback())
                .detailedFeedback(evaluation.getDetailedFeedback())
                .strengths(evaluation.getStrengths())
                .weaknesses(evaluation.getWeaknesses())
                .improvements(evaluation.getImprovements())
                .build();
    }
}
