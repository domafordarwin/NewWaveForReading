package com.literacy.assessment.controller;

import com.literacy.assessment.dto.CorrectionDto;
import com.literacy.assessment.service.CorrectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("/corrections")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CorrectionController {

    private final CorrectionService correctionService;

    @GetMapping("/{correctionId}")
    public ResponseEntity<CorrectionDto> getCorrection(@PathVariable Long correctionId) {
        try {
            return ResponseEntity.ok(correctionService.getCorrectionById(correctionId));
        } catch (RuntimeException e) {
            throw new ResponseStatusException(NOT_FOUND, e.getMessage());
        }
    }

    @GetMapping("/evaluation/{evaluationId}")
    public ResponseEntity<List<CorrectionDto>> getCorrectionsByEvaluation(@PathVariable Long evaluationId) {
        return ResponseEntity.ok(correctionService.getCorrectionsByEvaluationId(evaluationId));
    }
}
