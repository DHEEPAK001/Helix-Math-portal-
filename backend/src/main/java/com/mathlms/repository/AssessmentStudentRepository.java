package com.mathlms.repository;

import com.mathlms.entity.AssessmentStudent;
import com.mathlms.entity.AssessmentStudentId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssessmentStudentRepository extends JpaRepository<AssessmentStudent, AssessmentStudentId> {
    List<AssessmentStudent> findByAssessmentId(Long assessmentId);
    List<AssessmentStudent> findByStudentId(Long studentId);
}
