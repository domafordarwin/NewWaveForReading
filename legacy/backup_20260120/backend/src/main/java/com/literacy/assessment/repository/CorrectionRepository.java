package com.literacy.assessment.repository;

import com.literacy.assessment.entity.Correction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CorrectionRepository extends JpaRepository<Correction, Long> {
    List<Correction> findByEvaluationId(Long evaluationId);
}
