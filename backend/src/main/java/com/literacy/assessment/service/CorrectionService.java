package com.literacy.assessment.service;

import com.literacy.assessment.dto.CorrectionDto;
import com.literacy.assessment.entity.Correction;
import com.literacy.assessment.repository.CorrectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CorrectionService {

    private final CorrectionRepository correctionRepository;

    public CorrectionDto getCorrectionById(Long correctionId) {
        Correction correction = correctionRepository.findById(correctionId)
                .orElseThrow(() -> new RuntimeException("Correction not found: " + correctionId));
        return convertToDto(correction);
    }

    public List<CorrectionDto> getCorrectionsByEvaluationId(Long evaluationId) {
        return correctionRepository.findByEvaluationId(evaluationId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private CorrectionDto convertToDto(Correction correction) {
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
