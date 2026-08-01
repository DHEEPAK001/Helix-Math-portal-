package com.mathlms.service;

import com.mathlms.entity.LearningResource;
import com.mathlms.repository.LearningResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LearningResourceService {
    @Autowired
    private LearningResourceRepository repository;

    public List<LearningResource> getResourcesByGradeAndTopic(String grade, String topic) {
        return repository.findByGradeAndTopic(grade, topic);
    }
    
    public LearningResource addResource(LearningResource resource) {
        return repository.save(resource);
    }
}
