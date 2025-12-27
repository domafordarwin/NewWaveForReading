package com.literacy.assessment.controller;

import com.literacy.assessment.dto.AnswerCreateDto;
import com.literacy.assessment.dto.AnswerDto;
import com.literacy.assessment.entity.Answer;
import com.literacy.assessment.entity.Assessment;
import com.literacy.assessment.entity.Evaluation;
import com.literacy.assessment.repository.AnswerRepository;
import com.literacy.assessment.repository.AssessmentRepository;
import com.literacy.assessment.repository.EvaluationRepository;
import com.literacy.assessment.service.AIAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/answers")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AnswerController {
    
    private final AnswerRepository answerRepository;
    private final AssessmentRepository assessmentRepository;
    private final EvaluationRepository evaluationRepository;
    private final AIAnalysisService aiAnalysisService;
    
    @PostMapping
    public ResponseEntity<AnswerDto> createAnswer(@RequestBody AnswerCreateDto answerDto) {
        if (answerDto.getAssessmentId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "assessmentId is required");
        }

        Assessment assessment = assessmentRepository.findById(answerDto.getAssessmentId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Assessment not found: " + answerDto.getAssessmentId()
                ));

        Answer answer = answerRepository.findByAssessmentId(answerDto.getAssessmentId())
                .orElseGet(() -> Answer.builder().assessment(assessment).build());

        answer.setContent(answerDto.getContent());
        answer.setWordCount(answerDto.getWordCount());
        answer.setCharCount(answerDto.getCharCount());
        answer.setParagraphCount(answerDto.getParagraphCount());

        Answer savedAnswer = answerRepository.save(answer);
        return ResponseEntity.ok(convertToDto(savedAnswer));
    }
    
    @GetMapping("/{answerId}")
    public ResponseEntity<AnswerDto> getAnswer(@PathVariable Long answerId) {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Answer not found"));
        return ResponseEntity.ok(convertToDto(answer));
    }
    
    @GetMapping("/assessment/{assessmentId}")
    public ResponseEntity<AnswerDto> getAnswerByAssessment(@PathVariable Long assessmentId) {
        Answer answer = answerRepository.findByAssessmentId(assessmentId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Answer not found for assessment"
                ));
        return ResponseEntity.ok(convertToDto(answer));
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

    private AnswerDto convertToDto(Answer answer) {
        return AnswerDto.builder()
                .answerId(answer.getId())
                .assessmentId(answer.getAssessment() != null ? answer.getAssessment().getId() : null)
                .content(answer.getContent())
                .wordCount(answer.getWordCount())
                .charCount(answer.getCharCount())
                .paragraphCount(answer.getParagraphCount())
                .autoSavedAt(answer.getAutoSavedAt())
                .submittedAt(answer.getSubmittedAt())
                .version(answer.getVersion())
                .build();
    }
}
