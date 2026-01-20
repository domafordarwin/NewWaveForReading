package com.literacy.assessment.repository;

import com.literacy.assessment.entity.Assessment;
import com.literacy.assessment.entity.AssessmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    List<Assessment> findByStudentId(Long studentId);
    List<Assessment> findByStatus(AssessmentStatus status);
    List<Assessment> findByStudentIdAndStatus(Long studentId, AssessmentStatus status);
}
