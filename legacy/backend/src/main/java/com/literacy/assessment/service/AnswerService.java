package com.literacy.assessment.service;

import com.literacy.assessment.dto.AnswerCreateDto;
import com.literacy.assessment.dto.AnswerDto;
import com.literacy.assessment.entity.Answer;
import com.literacy.assessment.entity.Assessment;
import com.literacy.assessment.repository.AnswerRepository;
import com.literacy.assessment.repository.AssessmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnswerService {

    private final AnswerRepository answerRepository;
    private final AssessmentRepository assessmentRepository;

    public List<AnswerDto> getAllAnswers() {
        return answerRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public AnswerDto getAnswerById(Long answerId) {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found: " + answerId));
        return convertToDto(answer);
    }

    public AnswerDto getAnswerByAssessmentId(Long assessmentId) {
        Answer answer = answerRepository.findByAssessmentId(assessmentId)
                .orElseThrow(() -> new RuntimeException("Answer not found for assessment: " + assessmentId));
        return convertToDto(answer);
    }

    @Transactional
    public AnswerDto upsertAnswer(AnswerCreateDto answerDto) {
        if (answerDto.getAssessmentId() == null) {
            throw new RuntimeException("assessmentId is required");
        }

        Assessment assessment = assessmentRepository.findById(answerDto.getAssessmentId())
                .orElseThrow(() -> new RuntimeException("Assessment not found: " + answerDto.getAssessmentId()));

        Answer answer = answerRepository.findByAssessmentId(answerDto.getAssessmentId())
                .orElseGet(() -> Answer.builder().assessment(assessment).build());

        applyAnswerPayload(answer, answerDto);
        Answer savedAnswer = answerRepository.save(answer);
        return convertToDto(savedAnswer);
    }

    @Transactional
    public AnswerDto updateAnswer(Long answerId, AnswerCreateDto answerDto) {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found: " + answerId));

        applyAnswerPayload(answer, answerDto);
        Answer savedAnswer = answerRepository.save(answer);
        return convertToDto(savedAnswer);
    }

    private void applyAnswerPayload(Answer answer, AnswerCreateDto answerDto) {
        if (answerDto.getContent() != null) {
            answer.setContent(answerDto.getContent());
        }
        if (answerDto.getWordCount() != null) {
            answer.setWordCount(answerDto.getWordCount());
        }
        if (answerDto.getCharCount() != null) {
            answer.setCharCount(answerDto.getCharCount());
        }
        if (answerDto.getParagraphCount() != null) {
            answer.setParagraphCount(answerDto.getParagraphCount());
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
