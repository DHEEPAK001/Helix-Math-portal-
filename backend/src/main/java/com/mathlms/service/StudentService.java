package com.mathlms.service;

import com.mathlms.entity.Assessment;
import com.mathlms.entity.AssessmentStudent;
import com.mathlms.repository.AssessmentStudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    @Autowired
    private AssessmentStudentRepository assessmentStudentRepository;

    public List<Assessment> getMyAssessments(Long studentId) {
        List<AssessmentStudent> assignments = assessmentStudentRepository.findByStudentId(studentId);
        return assignments.stream()
                .map(AssessmentStudent::getAssessment)
                .collect(Collectors.toList());
    }
    
    public List<com.mathlms.entity.Question> getAssessmentQuestions(Long studentId, Long assessmentId) {
        List<AssessmentStudent> assignments = assessmentStudentRepository.findByStudentId(studentId);
        boolean isAssigned = assignments.stream().anyMatch(a -> a.getAssessment().getId().equals(assessmentId));
        if (!isAssigned) {
            throw new RuntimeException("Assessment not assigned to you");
        }
        
        Assessment assessment = assignments.stream().filter(a -> a.getAssessment().getId().equals(assessmentId)).findFirst().get().getAssessment();
        return assessment.getAssessmentQuestions().stream().map(com.mathlms.entity.AssessmentQuestion::getQuestion).collect(Collectors.toList());
    }
}
