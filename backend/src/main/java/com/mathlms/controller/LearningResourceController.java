package com.mathlms.controller;

import com.mathlms.entity.LearningResource;
import com.mathlms.service.LearningResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/learning-resources")
public class LearningResourceController {

    @Autowired
    private LearningResourceService learningResourceService;

    // Both Authenticated and Guest users should be able to view resources
    @GetMapping
    public ResponseEntity<List<LearningResource>> getResources(
            @RequestParam String grade,
            @RequestParam String topic) {
        return ResponseEntity.ok(learningResourceService.getResourcesByGradeAndTopic(grade, topic));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<LearningResource> addResource(@RequestBody LearningResource resource) {
        return ResponseEntity.ok(learningResourceService.addResource(resource));
    }
}
