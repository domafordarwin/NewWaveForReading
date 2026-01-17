package com.literacy.assessment.controller;

import com.literacy.assessment.dto.AnswerCreateDto;
import com.literacy.assessment.dto.AnswerDto;
import com.literacy.assessment.entity.Evaluation;
import com.literacy.assessment.service.AIAnalysisService;
import com.literacy.assessment.service.AnswerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/answers")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AnswerController {
    
    private final AIAnalysisService aiAnalysisService;
    private final AnswerService answerService;

    @GetMapping
    public ResponseEntity<List<AnswerDto>> getAllAnswers() {
        return ResponseEntity.ok(answerService.getAllAnswers());
    }
    
    @PostMapping
    public ResponseEntity<AnswerDto> createAnswer(@RequestBody AnswerCreateDto answerDto) {
        try {
            return ResponseEntity.ok(answerService.upsertAnswer(answerDto));
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @PutMapping("/{answerId}")
    public ResponseEntity<AnswerDto> updateAnswer(@PathVariable Long answerId, @RequestBody AnswerCreateDto answerDto) {
        try {
            return ResponseEntity.ok(answerService.updateAnswer(answerId, answerDto));
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }
    
    @GetMapping("/{answerId}")
    public ResponseEntity<AnswerDto> getAnswer(@PathVariable Long answerId) {
        try {
            return ResponseEntity.ok(answerService.getAnswerById(answerId));
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }
    
    @GetMapping("/assessment/{assessmentId}")
    public ResponseEntity<AnswerDto> getAnswerByAssessment(@PathVariable Long assessmentId) {
        try {
            return ResponseEntity.ok(answerService.getAnswerByAssessmentId(assessmentId));
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
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
