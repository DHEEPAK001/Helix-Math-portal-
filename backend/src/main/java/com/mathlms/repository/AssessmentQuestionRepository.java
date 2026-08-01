package com.mathlms.repository;

import com.mathlms.entity.AssessmentQuestion;
import com.mathlms.entity.AssessmentQuestionId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssessmentQuestionRepository extends JpaRepository<AssessmentQuestion, AssessmentQuestionId> {
    List<AssessmentQuestion> findByAssessmentId(Long assessmentId);
}
