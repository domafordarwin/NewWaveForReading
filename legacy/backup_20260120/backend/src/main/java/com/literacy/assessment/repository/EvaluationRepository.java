package com.literacy.assessment.repository;

import com.literacy.assessment.entity.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    Optional<Evaluation> findByAnswerId(Long answerId);
    List<Evaluation> findByAnswer_Assessment_Student_Id(Long studentId);
}
