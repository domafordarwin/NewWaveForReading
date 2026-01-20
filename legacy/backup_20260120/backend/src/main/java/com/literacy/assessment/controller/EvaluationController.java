package com.literacy.assessment.controller;

import com.literacy.assessment.dto.CorrectionDto;
import com.literacy.assessment.dto.EvaluationDto;
import com.literacy.assessment.service.CorrectionService;
import com.literacy.assessment.service.EvaluationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("/evaluations")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class EvaluationController {
    
    private final EvaluationService evaluationService;
    private final CorrectionService correctionService;
    
    @GetMapping("/{evaluationId}")
    public ResponseEntity<Map<String, Object>> getEvaluation(@PathVariable Long evaluationId) {
        EvaluationDto evaluation;
        try {
            evaluation = evaluationService.getEvaluationById(evaluationId);
        } catch (RuntimeException e) {
            throw new ResponseStatusException(NOT_FOUND, e.getMessage());
        }

        List<CorrectionDto> corrections = correctionService.getCorrectionsByEvaluationId(evaluationId);

        Map<String, Object> response = new HashMap<>();
        response.put("evaluation", evaluation);
        response.put("corrections", corrections);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/answer/{answerId}")
    public ResponseEntity<Map<String, Object>> getEvaluationByAnswer(@PathVariable Long answerId) {
        EvaluationDto evaluation;
        try {
            evaluation = evaluationService.getEvaluationByAnswerId(answerId);
        } catch (RuntimeException e) {
            throw new ResponseStatusException(NOT_FOUND, e.getMessage());
        }

        List<CorrectionDto> corrections = correctionService.getCorrectionsByEvaluationId(evaluation.getEvaluationId());

        Map<String, Object> response = new HashMap<>();
        response.put("evaluation", evaluation);
        response.put("corrections", corrections);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    public ResponseEntity<List<EvaluationDto>> getAllEvaluations() {
        return ResponseEntity.ok(evaluationService.getAllEvaluations());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<EvaluationDto>> getEvaluationsByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(evaluationService.getEvaluationsByStudentId(studentId));
    }
}
