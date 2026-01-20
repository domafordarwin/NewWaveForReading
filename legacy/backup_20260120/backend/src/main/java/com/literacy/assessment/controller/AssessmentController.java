package com.literacy.assessment.controller;

import com.literacy.assessment.dto.AssessmentDto;
import com.literacy.assessment.service.AssessmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/assessments")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AssessmentController {
    
    private final AssessmentService assessmentService;
    
    @GetMapping
    public ResponseEntity<List<AssessmentDto>> getAllAssessments() {
        List<AssessmentDto> assessments = assessmentService.getAllAssessments();
        return ResponseEntity.ok(assessments);
    }
    
    @GetMapping("/{assessmentId}")
    public ResponseEntity<AssessmentDto> getAssessmentById(@PathVariable Long assessmentId) {
        AssessmentDto assessment = assessmentService.getAssessmentById(assessmentId);
        return ResponseEntity.ok(assessment);
    }
    
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<AssessmentDto>> getAssessmentsByStudentId(@PathVariable Long studentId) {
        List<AssessmentDto> assessments = assessmentService.getAssessmentsByStudentId(studentId);
        return ResponseEntity.ok(assessments);
    }
    
    @PostMapping
    public ResponseEntity<AssessmentDto> createAssessment(@RequestBody AssessmentDto assessmentDto) {
        AssessmentDto createdAssessment = assessmentService.createAssessment(assessmentDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdAssessment);
    }
    
    @PutMapping("/{assessmentId}/start")
    public ResponseEntity<AssessmentDto> startAssessment(@PathVariable Long assessmentId) {
        AssessmentDto assessment = assessmentService.startAssessment(assessmentId);
        return ResponseEntity.ok(assessment);
    }
    
    @PutMapping("/{assessmentId}/submit")
    public ResponseEntity<AssessmentDto> submitAssessment(@PathVariable Long assessmentId) {
        AssessmentDto assessment = assessmentService.submitAssessment(assessmentId);
        return ResponseEntity.ok(assessment);
    }
}
