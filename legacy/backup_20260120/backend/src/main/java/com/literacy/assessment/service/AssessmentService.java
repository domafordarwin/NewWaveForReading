package com.literacy.assessment.service;

import com.literacy.assessment.dto.AssessmentDto;
import com.literacy.assessment.entity.*;
import com.literacy.assessment.repository.AssessmentRepository;
import com.literacy.assessment.repository.TopicRepository;
import com.literacy.assessment.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AssessmentService {
    
    private final AssessmentRepository assessmentRepository;
    private final UserRepository userRepository;
    private final TopicRepository topicRepository;
    
    public List<AssessmentDto> getAllAssessments() {
        return assessmentRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public AssessmentDto getAssessmentById(Long assessmentId) {
        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new RuntimeException("Assessment not found: " + assessmentId));
        return convertToDto(assessment);
    }
    
    public List<AssessmentDto> getAssessmentsByStudentId(Long studentId) {
        return assessmentRepository.findByStudentId(studentId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public AssessmentDto createAssessment(AssessmentDto assessmentDto) {
        User student = userRepository.findById(assessmentDto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found: " + assessmentDto.getStudentId()));
        
        Topic topic = topicRepository.findById(assessmentDto.getTopicId())
                .orElseThrow(() -> new RuntimeException("Topic not found: " + assessmentDto.getTopicId()));
        
        Assessment assessment = Assessment.builder()
                .student(student)
                .topic(topic)
                .assessmentType(assessmentDto.getAssessmentType())
                .status(AssessmentStatus.NOT_STARTED)
                .timeLimitMinutes(assessmentDto.getTimeLimitMinutes() != null ? assessmentDto.getTimeLimitMinutes() : 90)
                .wordCountMin(assessmentDto.getWordCountMin() != null ? assessmentDto.getWordCountMin() : 800)
                .wordCountMax(assessmentDto.getWordCountMax() != null ? assessmentDto.getWordCountMax() : 2000)
                .build();
        
        Assessment savedAssessment = assessmentRepository.save(assessment);
        return convertToDto(savedAssessment);
    }
    
    @Transactional
    public AssessmentDto startAssessment(Long assessmentId) {
        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new RuntimeException("Assessment not found: " + assessmentId));
        
        assessment.setStatus(AssessmentStatus.IN_PROGRESS);
        assessment.setStartedAt(LocalDateTime.now());
        
        Assessment updatedAssessment = assessmentRepository.save(assessment);
        return convertToDto(updatedAssessment);
    }
    
    @Transactional
    public AssessmentDto submitAssessment(Long assessmentId) {
        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new RuntimeException("Assessment not found: " + assessmentId));
        
        assessment.setStatus(AssessmentStatus.SUBMITTED);
        assessment.setSubmittedAt(LocalDateTime.now());
        
        Assessment updatedAssessment = assessmentRepository.save(assessment);
        return convertToDto(updatedAssessment);
    }
    
    private AssessmentDto convertToDto(Assessment assessment) {
        return AssessmentDto.builder()
                .assessmentId(assessment.getId())
                .studentId(assessment.getStudent().getId())
                .topicId(assessment.getTopic().getTopicId())
                .topicText(assessment.getTopic().getTopicText())
                .assessmentType(assessment.getAssessmentType())
                .status(assessment.getStatus())
                .startedAt(assessment.getStartedAt())
                .submittedAt(assessment.getSubmittedAt())
                .timeLimitMinutes(assessment.getTimeLimitMinutes())
                .wordCountMin(assessment.getWordCountMin())
                .wordCountMax(assessment.getWordCountMax())
                .build();
    }
}
