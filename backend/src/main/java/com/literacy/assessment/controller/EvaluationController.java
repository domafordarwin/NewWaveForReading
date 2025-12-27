package com.literacy.assessment.controller;

import com.literacy.assessment.dto.CorrectionDto;
import com.literacy.assessment.dto.EvaluationDto;
import com.literacy.assessment.entity.Correction;
import com.literacy.assessment.entity.Evaluation;
import com.literacy.assessment.repository.CorrectionRepository;
import com.literacy.assessment.repository.EvaluationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("/evaluations")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class EvaluationController {
    
    private final EvaluationRepository evaluationRepository;
    private final CorrectionRepository correctionRepository;
    
    @GetMapping("/{evaluationId}")
    public ResponseEntity<Map<String, Object>> getEvaluation(@PathVariable Long evaluationId) {
        Evaluation evaluation = evaluationRepository.findById(evaluationId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Evaluation not found"));
        
        List<Correction> corrections = correctionRepository.findByEvaluationId(evaluationId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("evaluation", convertToDto(evaluation));
        response.put("corrections", corrections.stream().map(this::convertCorrection).collect(Collectors.toList()));
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/answer/{answerId}")
    public ResponseEntity<Map<String, Object>> getEvaluationByAnswer(@PathVariable Long answerId) {
        Evaluation evaluation = evaluationRepository.findByAnswerId(answerId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Evaluation not found for answer"));
        
        List<Correction> corrections = correctionRepository.findByEvaluationId(evaluation.getId());
        
        Map<String, Object> response = new HashMap<>();
        response.put("evaluation", convertToDto(evaluation));
        response.put("corrections", corrections.stream().map(this::convertCorrection).collect(Collectors.toList()));
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    public ResponseEntity<List<EvaluationDto>> getAllEvaluations() {
        List<Evaluation> evaluations = evaluationRepository.findAll();
        List<EvaluationDto> response = evaluations.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
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

    private CorrectionDto convertCorrection(Correction correction) {
        return CorrectionDto.builder()
                .correctionId(correction.getId())
                .evaluationId(correction.getEvaluation() != null ? correction.getEvaluation().getId() : null)
                .correctionType(correction.getCorrectionType())
                .startPosition(correction.getStartPosition())
                .endPosition(correction.getEndPosition())
                .originalText(correction.getOriginalText())
                .correctedText(correction.getCorrectedText())
                .description(correction.getDescription())
                .severity(correction.getSeverity())
                .build();
    }
}
