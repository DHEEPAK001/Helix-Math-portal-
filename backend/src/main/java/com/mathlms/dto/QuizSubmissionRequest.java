package com.mathlms.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class QuizSubmissionRequest {
    private String grade;
    private String topic;
    private String difficulty;
    private List<QuizAnswerDto> answers;
}
