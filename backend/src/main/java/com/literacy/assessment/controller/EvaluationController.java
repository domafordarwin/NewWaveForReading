package com.literacy.assessment.controller;

import com.literacy.assessment.entity.Correction;
import com.literacy.assessment.entity.Evaluation;
import com.literacy.assessment.repository.CorrectionRepository;
import com.literacy.assessment.repository.EvaluationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
                .orElseThrow(() -> new RuntimeException("Evaluation not found"));
        
        List<Correction> corrections = correctionRepository.findByEvaluationId(evaluationId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("evaluation", evaluation);
        response.put("corrections", corrections);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/answer/{answerId}")
    public ResponseEntity<Map<String, Object>> getEvaluationByAnswer(@PathVariable Long answerId) {
        Evaluation evaluation = evaluationRepository.findByAnswerId(answerId)
                .orElseThrow(() -> new RuntimeException("Evaluation not found for answer"));
        
        List<Correction> corrections = correctionRepository.findByEvaluationId(evaluation.getId());
        
        Map<String, Object> response = new HashMap<>();
        response.put("evaluation", evaluation);
        response.put("corrections", corrections);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    public ResponseEntity<List<Evaluation>> getAllEvaluations() {
        List<Evaluation> evaluations = evaluationRepository.findAll();
        return ResponseEntity.ok(evaluations);
    }
}
