package com.mathlms.controller;

import com.mathlms.entity.Assessment;
import com.mathlms.security.UserDetailsImpl;
import com.mathlms.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/student")
@PreAuthorize("hasRole('STUDENT')")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @GetMapping("/assessments")
    public ResponseEntity<List<Assessment>> getMyAssessments(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(studentService.getMyAssessments(userDetails.getId()));
    }

    @GetMapping("/assessments/{id}/questions")
    public ResponseEntity<List<com.mathlms.entity.Question>> getAssessmentQuestions(@PathVariable Long id, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(studentService.getAssessmentQuestions(userDetails.getId(), id));
    }
}
