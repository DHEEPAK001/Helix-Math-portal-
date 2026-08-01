package com.mathlms.controller;

import com.mathlms.dto.QuizSubmissionRequest;
import com.mathlms.entity.Question;
import com.mathlms.entity.QuizResult;
import com.mathlms.security.UserDetailsImpl;
import com.mathlms.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @GetMapping("/questions")
    public ResponseEntity<List<Question>> getQuizQuestions(
            @RequestParam String grade,
            @RequestParam String topic,
            @RequestParam String difficulty) {
        return ResponseEntity.ok(quizService.fetchQuizQuestions(grade, topic, difficulty));
    }

    @PostMapping("/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<QuizResult> submitQuiz(@RequestBody QuizSubmissionRequest request, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        QuizResult result = quizService.submitQuiz(userDetails.getId(), request);
        return ResponseEntity.ok(result);
    }
}
