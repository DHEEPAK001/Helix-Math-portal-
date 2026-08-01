package com.mathlms.controller;

import com.mathlms.dto.MessageResponse;
import com.mathlms.dto.QuestionDto;
import com.mathlms.entity.Assessment;
import com.mathlms.entity.Question;
import com.mathlms.entity.StudentTeacher;
import com.mathlms.entity.User;
import com.mathlms.security.UserDetailsImpl;
import com.mathlms.service.TeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/teacher")
@PreAuthorize("hasRole('TEACHER')")
public class TeacherController {

    @Autowired
    private TeacherService teacherService;

    @GetMapping("/students")
    public ResponseEntity<List<StudentTeacher>> getMyStudents(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(teacherService.getMyStudents(userDetails.getId()));
    }

    @GetMapping("/available-students")
    public ResponseEntity<List<User>> getAvailableStudents(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(teacherService.getAvailableStudents(userDetails.getId()));
    }

    @PostMapping("/students/{studentId}")
    public ResponseEntity<?> addStudent(@PathVariable Long studentId, Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            teacherService.addStudent(userDetails.getId(), studentId);
            return ResponseEntity.ok(new MessageResponse("Student assigned successfully."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/students/{studentId}")
    public ResponseEntity<?> removeStudent(@PathVariable Long studentId, Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            teacherService.removeStudent(userDetails.getId(), studentId);
            return ResponseEntity.ok(new MessageResponse("Student removed successfully."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/questions")
    public ResponseEntity<List<Question>> getMyQuestions(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(teacherService.getMyQuestions(userDetails.getId()));
    }

    @PostMapping("/questions")
    public ResponseEntity<Question> createQuestion(@RequestBody QuestionDto dto, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(teacherService.createQuestion(userDetails.getId(), dto));
    }

    @PutMapping("/questions/{id}")
    public ResponseEntity<Question> updateQuestion(@PathVariable Long id, @RequestBody QuestionDto dto, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(teacherService.updateQuestion(userDetails.getId(), id, dto));
    }

    @DeleteMapping("/questions/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long id, Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            teacherService.deleteQuestion(userDetails.getId(), id);
            return ResponseEntity.ok(new MessageResponse("Question deleted successfully."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/assessments")
    public ResponseEntity<List<Assessment>> getMyAssessments(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(teacherService.getMyAssessments(userDetails.getId()));
    }

    @GetMapping("/questions/filter")
    public ResponseEntity<List<Question>> filterQuestions(
            @RequestParam String grade,
            @RequestParam String topic,
            @RequestParam String difficulty,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(teacherService.filterQuestions(grade, topic, difficulty, limit));
    }
    
    @GetMapping("/topics")
    public ResponseEntity<List<String>> getTopicsByGrade(
            @RequestParam String grade,
            @RequestParam(required = false) String difficulty) {
        if (difficulty != null && !difficulty.isEmpty()) {
            return ResponseEntity.ok(teacherService.getTopicsByGradeAndDifficulty(grade, com.mathlms.entity.Difficulty.valueOf(difficulty.toUpperCase())));
        }
        return ResponseEntity.ok(teacherService.getTopicsByGrade(grade));
    }
    
    @GetMapping("/grades")
    public ResponseEntity<List<String>> getAvailableGrades() {
        return ResponseEntity.ok(teacherService.getAvailableGrades());
    }

    @PostMapping("/assessments")
    public ResponseEntity<?> createAssessment(@RequestBody com.mathlms.dto.CreateAssessmentRequest request, Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Assessment assessment = teacherService.createAssessment(userDetails.getId(), request);
            return ResponseEntity.ok(assessment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PutMapping("/assessments/{id}/students")
    public ResponseEntity<?> updateAssessmentStudents(@PathVariable Long id, @RequestBody java.util.Map<String, List<Long>> request, Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Assessment assessment = teacherService.updateAssessmentStudents(userDetails.getId(), id, request.get("studentIds"));
            return ResponseEntity.ok(assessment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/analytics")
    public ResponseEntity<com.mathlms.dto.TeacherAnalyticsDto> getAnalytics(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(teacherService.getTeacherAnalytics(userDetails.getId()));
    }
}
