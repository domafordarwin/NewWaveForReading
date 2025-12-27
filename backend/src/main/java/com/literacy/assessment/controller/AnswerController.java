package com.literacy.assessment.controller;

import com.literacy.assessment.entity.Answer;
import com.literacy.assessment.entity.Evaluation;
import com.literacy.assessment.repository.AnswerRepository;
import com.literacy.assessment.repository.EvaluationRepository;
import com.literacy.assessment.service.AIAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/answers")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AnswerController {
    
    private final AnswerRepository answerRepository;
    private final EvaluationRepository evaluationRepository;
    private final AIAnalysisService aiAnalysisService;
    
    @PostMapping
    public ResponseEntity<Answer> createAnswer(@RequestBody Answer answer) {
        Answer savedAnswer = answerRepository.save(answer);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAnswer);
    }
    
    @GetMapping("/{answerId}")
    public ResponseEntity<Answer> getAnswer(@PathVariable Long answerId) {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));
        return ResponseEntity.ok(answer);
    }
    
    @GetMapping("/assessment/{assessmentId}")
    public ResponseEntity<Answer> getAnswerByAssessment(@PathVariable Long assessmentId) {
        Answer answer = answerRepository.findByAssessmentId(assessmentId)
                .orElseThrow(() -> new RuntimeException("Answer not found for assessment"));
        return ResponseEntity.ok(answer);
    }
    
    @PostMapping("/{answerId}/analyze")
    public ResponseEntity<Map<String, Object>> analyzeAnswer(@PathVariable Long answerId) {
        try {
            Evaluation evaluation = aiAnalysisService.analyzeAnswer(answerId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("evaluationId", evaluation.getId());
            response.put("totalScore", evaluation.getTotalScore());
            response.put("grade", evaluation.getGrade());
            response.put("message", "AI 분석이 완료되었습니다.");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "AI 분석 중 오류가 발생했습니다: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
