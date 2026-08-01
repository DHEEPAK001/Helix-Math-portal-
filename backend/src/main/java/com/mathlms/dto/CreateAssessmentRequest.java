package com.mathlms.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class CreateAssessmentRequest {
    private String title;
    private String description;
    private LocalDateTime availableFrom;
    private LocalDateTime deadline;
    
    private List<Long> questionIds;
    private List<Long> studentIds;
}
