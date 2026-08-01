package com.mathlms.service;

import com.mathlms.dto.QuestionDto;
import com.mathlms.entity.*;
import com.mathlms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class TeacherService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private AssessmentRepository assessmentRepository;

    @Autowired
    private AssessmentQuestionRepository assessmentQuestionRepository;

    @Autowired
    private AssessmentStudentRepository assessmentStudentRepository;

    @Autowired
    private StudentTeacherRepository studentTeacherRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private AiService aiService;

    @Autowired
    private QuizResultRepository quizResultRepository;

    public List<StudentTeacher> getMyStudents(Long teacherId) {
        return studentTeacherRepository.findByTeacherId(teacherId);
    }

    public com.mathlms.dto.TeacherAnalyticsDto getTeacherAnalytics(Long teacherId) {
        List<StudentTeacher> students = getMyStudents(teacherId);
        List<Long> studentIds = students.stream().map(st -> st.getStudent().getId()).toList();
        
        com.mathlms.dto.TeacherAnalyticsDto dto = new com.mathlms.dto.TeacherAnalyticsDto();
        dto.setTotalStudents(studentIds.size());
        
        if (studentIds.isEmpty()) return dto;

        List<QuizResult> results = quizResultRepository.findByStudentIdIn(studentIds);
        dto.setTotalTestsTaken(results.size());
        
        if (results.isEmpty()) return dto;

        double avgScore = results.stream().mapToDouble(r -> r.getScore().doubleValue()).average().orElse(0.0);
        dto.setAverageClassScore(avgScore);

        // Group by topic and average accuracy
        Map<String, Double> topicAcc = results.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        QuizResult::getTopic,
                        java.util.stream.Collectors.averagingDouble(r -> r.getAccuracy().doubleValue())
                ));

        List<com.mathlms.dto.TeacherAnalyticsDto.TopicPerformanceDto> perf = topicAcc.entrySet().stream()
                .map(e -> {
                    com.mathlms.dto.TeacherAnalyticsDto.TopicPerformanceDto p = new com.mathlms.dto.TeacherAnalyticsDto.TopicPerformanceDto();
                    p.setTopic(e.getKey());
                    p.setAverageAccuracy(e.getValue());
                    return p;
                }).toList();

        dto.setTopicPerformance(perf);
        return dto;
    }

    public List<Question> getMyQuestions(Long teacherId) {
        return questionRepository.findByAddedByTeacherId(teacherId);
    }

    @Transactional
    public Question createQuestion(Long teacherId, QuestionDto dto) {
        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        boolean isValid = aiService.verifyQuestion(dto);
        if (!isValid) {
            throw new RuntimeException("AI Verification Failed: The question appears to be invalid or lacks sufficient detail.");
        }

        Question q = new Question();
        q.setGrade(dto.getGrade());
        q.setTopic(dto.getTopic());
        q.setSubTopic(dto.getSubTopic());
        q.setDifficulty(dto.getDifficulty());
        q.setQuestionText(dto.getQuestionText());
        q.setOption1(dto.getOption1());
        q.setOption2(dto.getOption2());
        q.setOption3(dto.getOption3());
        q.setOption4(dto.getOption4());
        q.setCorrectOption(dto.getCorrectOption());
        q.setTutorialVideo(dto.getTutorialVideo());
        q.setDocumentation(dto.getDocumentation());
        q.setAddedByTeacher(teacher);
        q.setStatus(QuestionStatus.ACTIVE);
        q.setAiVerified(false); // Initially false until AI service verifies

        return questionRepository.save(q);
    }

    @Transactional
    public Question updateQuestion(Long teacherId, Long questionId, QuestionDto dto) {
        Question q = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        if (!q.getAddedByTeacher().getId().equals(teacherId)) {
            throw new RuntimeException("Unauthorized: You can only modify your own questions.");
        }

        q.setGrade(dto.getGrade());
        q.setTopic(dto.getTopic());
        q.setSubTopic(dto.getSubTopic());
        q.setDifficulty(dto.getDifficulty());
        q.setQuestionText(dto.getQuestionText());
        q.setOption1(dto.getOption1());
        q.setOption2(dto.getOption2());
        q.setOption3(dto.getOption3());
        q.setOption4(dto.getOption4());
        q.setCorrectOption(dto.getCorrectOption());
        
        return questionRepository.save(q);
    }

    @Transactional
    public void deleteQuestion(Long teacherId, Long questionId) {
        Question q = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        if (!q.getAddedByTeacher().getId().equals(teacherId)) {
            throw new RuntimeException("Unauthorized: You can only delete your own questions.");
        }

        questionRepository.delete(q);
    }

    public List<Assessment> getMyAssessments(Long teacherId) {
        return assessmentRepository.findByTeacherId(teacherId);
    }

    public List<Question> filterQuestions(String grade, String topic, String difficulty, int limit) {
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(0, limit);
        return questionRepository.findByGradeAndTopicAndDifficulty(grade, topic, Difficulty.valueOf(difficulty.toUpperCase()), pageable);
    }
    
    public List<String> getTopicsByGrade(String grade) {
        return questionRepository.findDistinctTopicsByGrade(grade);
    }
    
    public List<String> getTopicsByGradeAndDifficulty(String grade, Difficulty difficulty) {
        return questionRepository.findDistinctTopicsByGradeAndDifficulty(grade, difficulty);
    }
    
    public List<String> getAvailableGrades() {
        return questionRepository.findDistinctGrades();
    }

    @Transactional
    public Assessment createAssessment(Long teacherId, com.mathlms.dto.CreateAssessmentRequest request) {
        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        Assessment assessment = Assessment.builder()
                .teacher(teacher)
                .title(request.getTitle())
                .description(request.getDescription())
                .availableFrom(request.getAvailableFrom())
                .deadline(request.getDeadline())
                .build();
        
        Assessment savedAssessment = assessmentRepository.save(assessment);

        // Save questions
        if (request.getQuestionIds() != null) {
            for (Long qId : request.getQuestionIds()) {
                Question q = questionRepository.findById(qId).orElse(null);
                if (q != null) {
                    AssessmentQuestion aq = new AssessmentQuestion(savedAssessment, q);
                    assessmentQuestionRepository.save(aq);
                }
            }
        }

        // Save students
        if (request.getStudentIds() != null) {
            for (Long sId : request.getStudentIds()) {
                User s = userRepository.findById(sId).orElse(null);
                if (s != null) {
                    AssessmentStudent as = new AssessmentStudent();
                    as.setAssessment(savedAssessment);
                    as.setStudent(s);
                    as.setCompleted(false);
                    assessmentStudentRepository.save(as);
                }
            }
        }

        return savedAssessment;
    }

    public List<User> getAvailableStudents(Long teacherId) {
        return userRepository.findStudentsNotAssignedToTeacher(teacherId);
    }

    @Transactional
    public void addStudent(Long teacherId, Long studentId) {
        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // Check if already mapped to THIS teacher
        List<StudentTeacher> existing = studentTeacherRepository.findByStudentId(studentId);
        if (existing.stream().anyMatch(st -> st.getTeacher().getId().equals(teacherId))) {
            throw new RuntimeException("Student is already assigned to you");
        }

        StudentTeacher st = new StudentTeacher();
        st.setStudent(student);
        st.setTeacher(teacher);
        studentTeacherRepository.save(st);
    }

    @Transactional
    public void removeStudent(Long teacherId, Long studentId) {
        List<StudentTeacher> existing = studentTeacherRepository.findByStudentId(studentId);
        StudentTeacher st = existing.stream()
                .filter(mapping -> mapping.getTeacher().getId().equals(teacherId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Student is not assigned to you"));

        studentTeacherRepository.delete(st);
    }
    
    @Transactional
    public Assessment updateAssessmentStudents(Long teacherId, Long assessmentId, List<Long> studentIds) {
        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new RuntimeException("Assessment not found"));
                
        if (!assessment.getTeacher().getId().equals(teacherId)) {
            throw new RuntimeException("Unauthorized: You can only modify your own assessments.");
        }
        
        // Fetch current assignments
        List<AssessmentStudent> currentAssignments = assessment.getAssessmentStudents();
        List<Long> currentStudentIds = currentAssignments.stream().map(as -> as.getStudent().getId()).toList();
        
        // Find which students to add and which to remove
        List<Long> toRemove = currentStudentIds.stream().filter(id -> !studentIds.contains(id)).toList();
        List<Long> toAdd = studentIds.stream().filter(id -> !currentStudentIds.contains(id)).toList();
        
        // Remove students
        for (AssessmentStudent as : currentAssignments) {
            if (toRemove.contains(as.getStudent().getId())) {
                assessmentStudentRepository.delete(as);
            }
        }
        
        // Add students
        for (Long sId : toAdd) {
            User s = userRepository.findById(sId).orElse(null);
            if (s != null) {
                AssessmentStudent as = new AssessmentStudent();
                as.setAssessment(assessment);
                as.setStudent(s);
                as.setCompleted(false);
                assessmentStudentRepository.save(as);
            }
        }
        
        return assessment;
    }
}
